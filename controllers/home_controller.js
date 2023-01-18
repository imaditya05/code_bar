const { populate } = require('../models/post');
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){
    // console.log(req.cookies);
    // res.cookie('userid', 25);
    
    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Code Bar | Home",
    //         posts: posts
    //     })
    // });

    //Populate the user of each post 
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){

        User.find({}, function(err, users){
            return res.render('home', {
                title: "Code Bar | Home",
                posts: posts,
                all_users: users
            });
        });

        
    })
    }

