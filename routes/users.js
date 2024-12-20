var express = require('express')
var router = express.Router()
const { UserModel } = require('../models/index')

/* 注册请求 */
router.post('/', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      code: 400,
      msg: '用户名、密码不能为空',
    })
    return
  } else {
    UserModel.findOne({ username: req.body.username }).then(user => {
      if (user) {
        res.status(400).json({
          code: 400,
          msg: '用户名已存在',
        })
        return
      } else {
        const user = new UserModel(req.body)
        user.save().then(data => {
          res.status(200).json({
            code: 200,
            msg: '注册成功',
          })
        }).catch(err => {
          res.status(400).json({
            code: 400,
            msg: '注册失败',
            err: err,
          })
        })
      }
    }).catch(err => {
      res.status(400).json({
        code: 400,
        msg: '注册失败' + err,
        err: err,
      })
    })
  }
})

/**
 * 登录接口
 */
const jwt = require('jsonwebtoken')

router.get('/', function (req, res, next) {
  console.log(req.query)
  if (!req.query.username || !req.query.password) {
    res.status(400).json({
      code: 400,
      msg: '用户名或密码不能为空',
    })
    return
  } else {
    UserModel.findOne({ username: req.query.username }).then(user => {
      if (user) {
        if (user.password === req.query.password) {
          const token = jwt.sign({ username: user.username, uid: user._id }, 'test123456', {
            expiresIn: '1h',
            algorithm: "HS256",

          })
          res.status(200).json({
            code: 200,
            msg: '登录成功',
            data: {
              token: token,
              username: user.username,
              uid: user._id,
              nickname: user.nickname,
              headImgUrl: user.headImgUrl,
            },
          })
        } else {
          res.status(400).json({
            code: 400,
            msg: '用户名或密码错误',
          })
        }
      } else {
        res.status(400).json({
          code: 400,
          msg: '用户不存在',
        })
      }
    }).catch(err => {
      res.status(400).json({
        code: 400,

      })
    })
  }
})
/**获取用户信息接口 */
router.get('/info', function (req, res, next) {

  UserModel.findOne({ username: req.auth.username }).then(user => {
    if (user) {
      res.status(200).json({
        code: 200,
        msg: '获取用户信息成功',
        data: user,
      })
    } else {
      res.status(400).json({
        code: 400,
        msg: '用户不存在',
      })
    }
  }).catch(err => {
    res.status(400).json({
      code: 400,
      msg: '获取用户信息失败',
    })
  })
}
)





module.exports = router
