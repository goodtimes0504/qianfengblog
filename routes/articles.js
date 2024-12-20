var express = require('express');
var router = express.Router();

/* 匹配/api/articles 才会进来 */
/**发布文章 */
router.post('/', function (req, res, next) {
  console.log(req.body);
  console.log(req.auth);//{ username: 'admin', iat: 1734666498, exp: 1734752898 }
  res.json({
    code: 1,
    message: '文章发布成功'
  })
});
/** 根据用户uid获取某个用户名下的所有文章列表 */
router.get('/users/:uid', function (req, res, next) {
  console.log(req.params);
  res.json({
    code: 1,
    message: '根据用户id获取文章列表成功',
    data: [
      {
        aid: 1,
        title: '文章标题1',
        content: '文章内容1'
      },
      {
        aid: 2,
        title: '文章标题2',
        content: '文章内容2'
      }
    ]
  })
})
/** 根据文章aid查看对应文章详情 */
router.get('/:aid', function (req, res, next) {
  console.log(req.params);
  res.json({
    code: 1,
    message: '根据文章id获取文章详情成功',
    data: {
      aid: 1,
      title: '文章标题1',
      content: '文章内容1'
    }
  })
})
/**根据文章aid删除对应文章 */
router.delete('/:aid', function (req, res, next) {
  console.log(req.params);
  res.json({
    code: 1,
    message: '根据文章id删除文章成功'
  })
})
/**根据文章aid 编辑文章 */
router.patch('/:aid', function (req, res, next) {
  console.log(req.params);
  console.log(req.body);
  res.json({
    code: 1,
    message: '根据文章id编辑文章成功',

  })
})
module.exports = router;
