var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// ======================
// COMMENTS ROUTES
// ======================

// (COMMENTS NEW) NEW COMMENTS ROUTES - (basically it takes us to the new comment form page.)
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campGround){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campGround})
        }
    })
})

// COMMENTS - POST ROUTES (COMMENTS CREATE)
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground1){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment1){
                if(err){
                    req.flash("error", "Something went wrong")
                    console.log(err);
                } else{
                    // add username and id to comment1
                    comment1.author.id = req.user._id;
                    comment1.author.username = req.user.username;
                    // save comment
                    comment1.save();
                    // connect new comment to campground
                    campground1.comments.push(comment1);
                    campground1.save();
                    // redirect campground show page
                    req.flash("success", "Successfully added Comment to " + campground1.name)
                    res.redirect('/campgrounds/' + campground1._id);

                }
            })
        }
    })
})


// COMMENTS EDIT ROUTE
// Campground Edit Route-	 /campgrounds/:id/edit
// Comment Edit Route -	 /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back")
        } else{
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment})
        }
    })
})

// COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// Delete Comment
// Campground Destroy Route -/campgrounds/:id
// Comment Destroy Route	 -/campgrounds/:id/comments/:comment_id
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    // findByIdAndRemove
    Comment.findByIdAndDelete(req.params.comment_id, function(err,){
        if(err){
            res.redirect("back")
        } else{
            req.flash("success", "Comment Deleted")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// MIDDELWARE

module.exports = router;