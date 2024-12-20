const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    //上传图片的路径
    destination: function (req, file, cb) {
        //是告诉 Multer 把上传的图片都存放到服务器端项目目录下的 public/images 文件夹中，并且通过 cb(null, 'public/images') 将这个路径传递回去
        cb(null, 'public/images')
    },
    //上传图片的名称
    filename: function (req, file, cb) {
        //path.extname(file.originalname)获取文件后缀名输入.jpg .png等格式
        //cb是 callback回调函数 第一个参数 null表示没有错误，第二个参数是文件名 这里用时间戳加上.文件类型代表文件名
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
//创建multer对象实例，并设置存储方式
// single方法只处理一个文件上传
// img是上传的文件的key值，对应表单中input的name值 用来准确的获取上传的文件
/**
 * 如果不设置single('img')（或其他类似的single、array、fields方法），Multer中间件就不知道如何从传入的multipart/form - data请求中提取文件相关信息。因为在一个multipart/form - data请求中，可能包含多个不同的部分，比如除了文件，还可能有其他表单字段（如文本输入框、单选按钮等）。
没有指定文件对应的字段名，Multer就无法明确哪个部分是需要处理的文件，这会导致无法正确识别和提取要上传的文件。例如，假设前端表单有<input type="file" name="avatar" />和<input type="text" name="username" />，如果不在服务器端的Multer配置中指定要处理的文件字段名（如single('avatar')），Multer就不知道avatar这个文件字段是需要提取和处理的内容。
 */
//总结 如果不设置single('img) multer就无法明确哪个部分是需要处理的文件
//请求体里面必须有一个img字段，否则会报错
const upload = multer({
    storage: storage,
    // onError: function (err, req, res, next) {
    //     console.error('文件上传出现错误:', err);
    //     res.status(500).json({
    //         code: 0,
    //         message: '文件上传出现错误，请稍后再试',
    //         data: null
    //     });
    // }
}).single('img')


// router.post('/', upload, (req, res) => {
//     const file = req.file
//     console.log(file)//文件信息 包含文件名、路径等
//     let imgUrl = '/images/' + file.filename
//     console.log(imgUrl)//文件路径 例如 /images/xxxx.jpg;
//     res.json({
//         code: 1,
//         message: '上传文件成功',
//         // 注意 返回的路径不需要加public 因为用户使用http://localhost:3001/images/xxxx.jpg 访问的时候
//         // 会自动进入public文件夹去找静态资源
//         data: imgUrl
//     })
// })
router.post('/', upload, (req, res) => {
    try {
        const file = req.file;
        console.log(file); //文件信息 包含文件名、路径等
        let imgUrl = '/images/' + file.filename;
        console.log(imgUrl); //文件路径 例如 /images/xxxx.jpg;
        res.json({
            code: 1,
            message: '上传文件成功',
            // 注意 返回的路径不需要加public 因为用户使用http://localhost:3001/images/xxxx.jpg 访问的时候
            // 会自动进入public文件夹去找静态资源
            data: imgUrl
        });
    } catch (err) {
        console.error('文件上传过程中出现同步错误:', err);
        res.status(500).json({
            code: 0,
            message: '文件上传出现同步错误，请稍后再试',
            data: null
        });
    }
});

module.exports = router;