var geocoder = require("geocoder"),
    express = require("express"),
    router = express.Router();
    
// MIDDLEWARE config
var middleware = require("../middleware");
    
// MODELOS config
var Campground = require("../models/campground");

// INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    geocoder.geocode(req.body.campground.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var campground = {
            name: req.body.campground.name,
            image: req.body.campground.image,
            description: req.body.campground.description,
            price: req.body.campground.price,
            location: location,
            lat: lat,
            lng: lng,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };
        Campground.create(campground, function(err, campground){
            if(err) {
                res.redirect("back");
            } else {
                res.redirect("/campgrounds");
            }
        });
    });
});

// SHOW 
router.get("/:id", function(req, res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        if(err || !campground) {
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campground){
        if(err || !campground){
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
    var id = req.params.id;
    geocoder.geocode(req.body.campground.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        req.body.campground.lat = lat;
        req.body.campground.lng = lng;
        req.body.campground.location = location;
        var updatedCampground = req.body.campground;
        Campground.findByIdAndUpdate(id, updatedCampground, function(err, campground){
            if(err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + id);
            }
        });
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    var id = req.params.id;
    Campground.findByIdAndRemove(id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});
    
module.exports = router;