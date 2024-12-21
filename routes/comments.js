const express = require('express');
const router = express.Router();
const { CommentModel, ArticleModel } = require('../models/index');

/*
/api/comments
发布评论
*/
router.post("/", function (req, res, next) {
    console.log(req.body); //文章的id 评论内容
    console.log(req.auth);//uid
    // 作者的id 在
    // 发布文章的时候需要作者id
    // { username: 'admin', iat: 1668954424, exp: 1668954544 }
    CommentModel.create({ ...req.body, reply_user_id: req.auth.uid })
        .then((r) => {
            res.json({
                code: 1,
                msg: "发布评论成功",
                data: r,
            });
        })
        .catch((err) => {
            res.json({
                code: 1,
                msg: "发布评论失败",
            });
        });
});
/*
/api/articles/users/:uid
根据文章id获取评论列表
*/
router.get("/articles/:aid", function (req, res, next) {
    console.log(req.params); //{uid:11}
    CommentModel.find({ article_id: req.params.aid })
        .populate("reply_user_id", { password: 0 })
        .then((r) => {
            res.json({
                code: 1,
                msg: "根据article id获取comment列表成功",
                data: r,
            });
        });
});
/*
/api/:cid
根据评论id删除评论
*/
router.delete("/:cid", async function (req, res, next) {
    // req.auth.uid ===
    // 登录的uid 和 文章的作者的id一样--才能具有删除权限
    console.log(req.params); //{uid:11}
    //根据评论id找文章id
    let { article_id } = await CommentModel.findById(req.params.cid);
    //根据文章id找作者id 注意 作者id就是author 不是_id _id在文章集合里是文章id
    //article_id是评论集合里的字段 关联了文章集合的_id 文章集合里的author是作者id 关联了用户集合的_id
    let { author } = await ArticleModel.findById(article_id);
    // req.auth.uid
    //判断当前用户是否和文章作者id一样 一样的话才有删除评论的权限
    if (author == req.auth.uid) {
        console.log(req.params); //{uid:11}
        CommentModel.findByIdAndDelete(req.params.cid).then((r) => {
            if (r) {
                res.json({
                    code: 1,
                    msg: "删除评论 成功",
                });
            } else {
                res.json({
                    code: 0,
                    msg: "删除评论-已经被删除",
                });
            }
            console.log(r);
        });
    } else {
        res.json({
            code: 0,
            msg: "删除评论-没有删除权限",
        });
    }
});

module.exports = router;