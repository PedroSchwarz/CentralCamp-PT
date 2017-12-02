// MODELOS config
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/users/login");
    }
}

middlewareObj.checkCampgroundOwner = function(req, res, next){
    if(req.isAuthenticated()){
        var campgroundId = req.params.id;
        Campground.findById(campgroundId, function(err, campground){
            if(err || !campground){
                res.redirect("back");
            } else {
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("/users/login");
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        var commentId = req.params.comment_id;
        Comment.findById(commentId, function(err, comment) {
            if(err || !comment){
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("/users/login");
    }
}



