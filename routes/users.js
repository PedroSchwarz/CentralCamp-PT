var express = require("express"),
    passport = require("passport"),
    router = express.Router();
    
// MODELOS config
var User = require("../models/user");

// NEW form
router.get("/new", function(req, res){
   res.render("users/new"); 
});

// CREATE
router.post("/", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var newUser = {username: username};
    User.register(newUser, password, function(err, user){
        if (err) {
            req.flash("failure", err.message + "!");
            res.redirect("/users/new");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Bem-vindo to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// LOGIN form
router.get("/login", function(req, res){
    res.render("users/login");
});

// LOGIN
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/users/login"
}), function(req, res){
});

// LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Desconectado!");
    res.redirect("/campgrounds");
});
    
module.exports = router;