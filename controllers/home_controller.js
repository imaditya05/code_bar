const { populate } = require('../models/post');
const Post = require('../models/post');

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
    Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home', {
            title: "Code Bar | Home",
            posts: posts
        })
    })
    }

