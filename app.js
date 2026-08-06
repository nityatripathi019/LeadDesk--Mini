const express = require('express');
const app = express();
const port = 8000;
const path = require("path");
const Lead = require("./models/Lead.js");
const { default: mongoose } = require('mongoose');
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");
const session = require("express-session");
const auth = require("./middleware/auth");
const methodOverride = require("method-override");
const isLoggedIn = require("./middleware/auth");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

//database connection
main()
  .then(async () => {
    console.log("db connected successfully");
    await createAdmin();
  }).catch((err) => console.log(err));

async function main() {

  await mongoose.connect('mongodb://127.0.0.1:27017/lead-db');

};


async function createAdmin() {
  const existingAdmin = await Admin.findOne({ username: "admin" });
  // console.log(existingAdmin);

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      password: hashedPassword
    });

    console.log("Default admin created");
  }
}




app.get("/", (req, res) => {
  const success = req.session.success;

  req.session.success = null;

  res.render("index", { success });
})

app.post("/lead", async (req, res) => {
  console.log(req.body);

  try {
    const { name, email, budget, message } = req.body;

    //server side validation
    if (!name || !email || !budget || !message) {
      return res.send("All fields are required.");
    }

    const lead = new Lead({
      name,
      email,
      budget,
      message
    })

    await lead.save();
    req.session.success = "🎉 Lead submitted successfully! We'll contact you soon.";

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
})

app.get("/admin", isLoggedIn, async (req, res) => {

  const search = req.query.search || "";

  const leads = await Lead.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  });

  res.render("admin", {
    leads,
    search
  });

});

app.put("/admin/:id/status", async (req, res) => {

  await Lead.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    }
  );

  res.redirect("/admin");

});

app.delete("/admin/:id", async (req, res) => {

  try {

    await Lead.findByIdAndDelete(req.params.id);

    res.redirect("/admin");

  } catch (err) {

    console.log(err);

    res.status(500).send("Unable to delete lead.");

  }

});
//login routes 
app.get("/login", (req, res) => {
  res.render("login");
})


app.post("/login", async (req, res) => {
  // console.log(req.body);
  const { username, password } = req.body;
  // console.log(username);
  const admin = await Admin.findOne({ username });
  // console.log(admin);
  if (!admin) {
    return res.send("Invalid Username");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.send("Invalid Password");
  }

  req.session.adminId = admin._id;

  res.redirect("/admin");

});

app.get("/logout", (req, res) => {

  req.session.destroy(() => {

    res.redirect("/login");

  });

});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
})