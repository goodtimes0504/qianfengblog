var express = require('express')
var router = express.Router()
var ArticleModel = require('../models/index.js')

/* 匹配/api/articles 才会进来 */
/**发布文章 */
router.post('/', function (req, res, next) {
  ArticleModel.create({ ...req.body, author: req.auth.uid })
    .then(res => {
      res.json({
        code: 1,
        msg: '发布文章成功',
        data: res,
      })
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: '发布文章成功',
      })
    })
})

/*
/api/articles/users/:uid
根据用户id获取文章列表
*/
router.get('/users/:uid', function (req, res, next) {
  console.log(req.params) //{uid:11}
  ArticleModel.find({ author: req.params.uid })
    .populate('author', { password: 0 })
    .populate('coms')
    .then(r => {
      res.json({
        code: 1,
        msg: '根据用户id获取文章列表成功',
        data: r,
      })
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: '根据用户id获取文章列表成功',
        data: err,
      })
    })
})
/*
/api/articles/:aid
根据文章id获取文章详情
*/
router.get('/:aid', function (req, res, next) {
  console.log(req.params) //{aid:11}
  //根据id 查询并且更新数据
  //为什么用findByIdAndUpdate 是因为每次查询数据都会自动更新数据的views 字段
  ArticleModel.findByIdAndUpdate(
    req.params.aid,
    { $inc: { views: 1 } }, //views 增加1
    { new: true } //查询最新的结果
  )
    .populate('author', { password: 0 })
    .populate('coms')
    .then(r => {
      res.json({
        code: 1,
        msg: '根据文章id获取文章详情',
        data: r,
      })
    })
})
/*
/api/articles/:aid
根据文章id删除文章
*/
router.delete('/:aid', function (req, res, next) {
  console.log(req.params) //{uid:11}
  ArticleModel.findByIdAndDelete(req.params.aid).then(r => {
    if (r) {
      res.json({
        code: 1,
        msg: '删除文章 成功',
      })
    } else {
      res.json({
        code: 0,
        msg: '删除文章-已经被删除',
      })
    }
    console.log(r)
  })
})

/*
/api/articles/:aid
根据文章id编辑文章
*/
router.patch('/:aid', async function (req, res, next) {
  console.log(req.params) //{aid:11}
  console.log(req.body)
  // { new: true }选项表示返回更新后的文章对象。如果不设置这个选项，返回的将是更新前的文章对象。默认情况下返回的是更新前的对象。
  let r = await ArticleModel.findByIdAndUpdate(
    req.params.aid,
    { ...req.body },
    { new: true }
  )
  res.json({
    code: 1,
    msg: '根据文章aid修改文章成功',
    data: r,
  })
})
module.exports = router
