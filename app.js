const express = require("express");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();




//getting html content form the base.html

// view engine setup
app.engine(
  "handlebars",
  exphbs.engine({
    extname: "exphbs",
    defaultLayout: false,
    layoutsDir: "views/ ",
  })
);

app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//static folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  console.log("this is get method");
  res.render("contact");
});
let email;

let transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  service: null,

  auth: {
    user: "no-reply@alt-pi.in",
    pass: "P9!6_Dgb6o",
  },
});
let otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);



app.post("/send", function (req, res) {
  console.log("this is post method ");
  var htmlcontent = req.body.fileContent;
  console.log("this is requested body", htmlcontent ,otp);
  //email = req.body.email;

  // send mail with defined transport object
  var mailOptions = {
    from: "no-reply@alt-pi.in",
    to: req.body.email,
    subject: "Otp for registration is: ",
    html:
      "From alt pi to you" +
      htmlcontent +
      "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("email sent ", info.response);

    res.render("otp");
  });
});
app.post("/resend", function (req, res) {
  var mailOptions = {
    to: email,
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render("otp", { msg: "otp has been sent" });
  });
});
app.post("/verify", function (req, res) {
  if (req.body.otp == otp) {
    res.send("You has been successfully registered");
  } else {
    res.render("otp", { msg: "otp is incorrect" });
  }
});

//defining port
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`app is live at http://localhost:${PORT}`);
});
  