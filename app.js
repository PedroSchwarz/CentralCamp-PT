// PACOTES config
var methodOverride = require("method-override"),
    expressSession = require("express-session"),
    LocalStrategy = require("passport-local"),
    connectFlash = require("connect-flash"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();
    
// MODELOS config    
var User = require("./models/user");
    
// MONGOOSE config
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp_pt", {useMongoCliente: true});

// PASSPORT config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializaUser());
passport.deserializeUser(User.deserializaUser());

// APP(EXPRESS) config
app.use(bodyParser.urlencoded({extended: true}));
app.use(connectFlash());
app.use(methodOverride(__dirname + "/public"));
app.use(expressSession({
    secret: "Este e o secredo para o projeto YelpCamp-PT",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// EJS config
app.set("view engine", "ejs");

// SERVIDOR config
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Servidor inicializado!");
});
