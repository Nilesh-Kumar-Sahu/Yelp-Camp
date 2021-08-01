var mongoose    =    require("mongoose");
var Campground  =    require("./models/campground");
var Comment     =    require("./models/comment");

var data = [
    {
        name:"Mountain Goat's Rest",
        image:"https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142__340.jpg",
        description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary,"
    },
    {
        name:"Sky blue",
        image:"https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg",
        description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary,"
    },
    {
        name:"Mongolia",
        image:"https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242__340.jpg",
        description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary,"
    }
]

function seedDB(){
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    // Create a comment
                    Comment.create(
                        {
                            text:"This Place is great, but i wish there was internet here!So SAD :/",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comments here");
                            }
                        }
                    )
                }
            });
        });
    })
}

module.exports = seedDB;