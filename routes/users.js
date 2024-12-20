var express = require('express')
var router = express.Router()
const { UserModel } = require('../models/index')

/* 注册请求 */
router.post('/', function (req, res, next) {
  // console.log(req.body)
  const { username, password } = req.body
  res.status(200).json({
    code: 200,
    msg: '注册成功',
  })
})

/**
 * 登录接口
 */
const jwt = require('jsonwebtoken')

router.get('/', function (req, res, next) {
  console.log(req.query)

  if (req.query.username === 'admin' && req.query.password === '123456') {
    //如果登录成功，生成token并在token中存储用户名并设置过期时间并返回token
    const token = jwt.sign(
      {
        username: req.query.username, //token中存储用户名
      },
      'test123456',
      {
        expiresIn: '1d', //过期时间
        algorithm: 'HS256', //加密算法
      }
    )
    res.status(200).json({
      code: 1,
      msg: '登录成功',
      data: {
        token: token,
      },
    })
  } else {
    res.json({
      code: 0,
      msg: '登录失败',
    })
  }
})

module.exports = router
