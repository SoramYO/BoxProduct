const express = require("express");
const router = require("./routes/client/index.route");
const routerAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const dotenv = require("dotenv");
const methodOveride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const systemConfig = require("./config/system");
const path = require('path');
dotenv.config();

const app = express();
const port = process.env.PORT;


// Set up the view engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
// Set up the static file
app.use(express.static(`${__dirname}/public`));
//Set the method-override
app.use(methodOveride("_method"));
//Set parser application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.ADMIN_PATH = systemConfig.ADMIN_PATH;
//Set flash
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

//Set router
router(app);
routerAdmin(app);


database.connect();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
