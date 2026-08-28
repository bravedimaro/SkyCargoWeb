require('dotenv').config();
const express = require("express");
const app = express();
const https = require("https")
const bodyParser = require('body-parser');
const path = require("path");
const ejs = require('ejs');
const {conn} = require('./middleware/db');
const port = process.env.PORT || 8000;
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const session = require('express-session');


app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SESSION_SECRET || 'this is my secretkey',
    resave: false,
    cookie:{secure: true,maxAge: 1000 * 60 },
    saveUninitialized: true,
}));

app.use((req, res, next) => {
  conn.query("SELECT data FROM tbl_validate", (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return next(err);
    }
    const scriptFile = results[0].data; // Get the script file data

    // Set the scriptFile variable in res.locals
    res.locals.scriptFile = scriptFile;
    next();
  });
});

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.use(function (req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.errors = req.flash("errors");
    next();
});


// ========== define router =========== //

app.use("/", require("./routers/login"));
app.use("/index", require("./routers/index"));
app.use("/online_shopping", require("./routers/online_shopping"));
app.use("/users", require("./routers/users"));
app.use("/settings", require("./routers/settings"));
app.use("/shipping", require("./routers/shipping"));
app.use("/pickup", require("./routers/pickup"));
app.use("/consolidated", require("./routers/consolidated"));
app.use("/transactions", require("./routers/transactions"));
app.use("/report", require("./routers/report"));


app.listen(port, () => {
    console.log(`server running on port ${port}`);
})