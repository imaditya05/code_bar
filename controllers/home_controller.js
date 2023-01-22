const { populate } = require("../models/post");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  //Populate the user of each post
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
        },
      });

    let users = await User.find({});

    return res.render("home", {
      title: "Code Bar | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Error", err);
  }
};
