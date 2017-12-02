var express = require("express"),
    router = express.Router({mergeParams: true});

// MIDDLEWARE config
var middleware = require("../middleware");

// MODELOS config
var Comment = require("../models/comment");
var Campground = require("../models/campground");

// NEW 
router.get("/new", middleware.isLoggedIn, function(req, res){
    var campgroundId = req.params.id;
    Campground.findById(campgroundId, function(err, campground){
        if(err || !campground) {
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var campgroundId = req.params.id;
    Campground.findById(campgroundId, function(err, campground){
        if(err || !campground) {
            res.redirect("/campgrounds");
        } else {
            var comment = {
                text: req.body.comment.text,
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            }
            Comment.create(comment, function(err, comment){
                if(err) {
                    res.redirect("back");
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campgroundId);
                }
            });
        }
    });
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    var campgroundId = req.params.id;
    Campground.findById(campgroundId, function(err, campground) {
        if(err || !campground) {
            res.redirect("back")
        } else {
            var commentId = req.params.comment_id;
            Comment.findById(commentId, function(err, comment) {
                if(err || !comment){
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground: campground, comment: comment});
                }
            });
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    var campgroundId = req.params.id;
    var commentId = req.params.comment_id;
    var updatedComment = req.body.comment;
    Comment.findByIdAndUpdate(commentId, updatedComment, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + campgroundId);
        }
    });
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
    var campgroundId = req.params.id;
    var commentId = req.params.comment_id;
    Comment.findByIdAndRemove(commentId, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + campgroundId);
        }
    });
});

module.exports = router;