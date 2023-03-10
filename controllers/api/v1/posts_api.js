const Post = require("../../../models/post");

const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
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

  return res.json(200, {
    message: "List of Posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  let post = await Post.findById(req.params.id);
  try {
    //.id means convertin the object into string
    if (post.user == req.user.id) {
      post.remove();

      await Comment.deleteMany({ post: req.params.id });

      return res.json(200, {
        message: "Posts and associated comments deleted successfully",
      });
    } else {
      return res.json(401, {
        message: "You cannot delete this post",
      });
    }
  } catch (err) {
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
