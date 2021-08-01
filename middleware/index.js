var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!")
                res.redirect("back")
            } else{
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){     
                //foundCampground.author.id -- mongoose object, req.user._id -- string
                    next();
                } else{
                    req.flash("error", "Permission denied!")
                    // otherwise, redirect
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "Please login for more options!")
        // if not, redirect
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            } else{
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){     
                //foundCampground.author.id -- mongoose object, req.user._id -- string
                   next();
                } else{
                    req.flash("error", "You don't have the permission to that!!")
                    // otherwise, redirect
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!")
        // if not, redirect
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to login first!")
    res.redirect("/login");
};

module.exports = middlewareObj