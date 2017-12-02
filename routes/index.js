var express = require("express"),
    router = express.Router();

// LANDING page
router.get("/", function(req, res){
    res.render("../views/landing");
});

module.exports = router;