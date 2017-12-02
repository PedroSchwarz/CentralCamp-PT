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

// ROTAS setup
var indexRoutes = require("./routes/index");
var userRoutes = require("./routes/users");
var campgroundsRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
    
// MONGOOSE config
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp_pt", {useMongoClient: true});

// PASSPORT config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

// EJS config
app.set("view engine", "ejs");

// SERVIDOR config
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Servidor inicializado!");
});
