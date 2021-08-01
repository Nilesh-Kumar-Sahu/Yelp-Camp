var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all camphrounds
router.get('/', function(req, res){   
    // Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds1:allcampgrounds});    
        }
    });
});

// CREATE - add new campgrounds
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from FORM and add to campgrounds array
    var name1= req.body.name;
    var image1= req.body.image;
    var desc= req.body.description;
    var money = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground= {name: name1, image:image1, description: desc, price: money, author: author};
    //Create a new campgrounds and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            conosole.log(err);
        } else {
            // redirect back to campgrounds page
            // console.log(newlyCreated);
            res.redirect("/campgrounds")
        }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground)
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
    })
})
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        } else{
            req.flash("success", "You have successfully edited your " + updatedCampground.name +" Camp!")
            // redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id)
        }
    })    
})
// DESTROY CAMPGROND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

// MIDDELWARE

module.exports = router;