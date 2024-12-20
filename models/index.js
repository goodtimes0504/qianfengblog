// 引入 mongoose 模块
const mongoose = require('mongoose');

// 连接到本地 MongoDB 数据库，数据库名为 qianfeng-blog
mongoose.connect('mongodb://localhost:27017/qianfeng-blog')
    .then((res) => {
        // 连接成功时输出日志
        console.log('数据库连接成功' + res);
    })
    .catch((err) => {
        // 连接失败时输出错误日志
        console.log('数据库连接失败' + err);
    });

// 创建一个 Schema 对象，用于定义数据模型的结构
const Schema = mongoose.Schema;

// 定义 Article 数据模型的 Schema
const ArticleSchema = new Schema({
    // 文章标题，类型为字符串
    title: String,
    // 文章内容，类型为字符串
    content: String,
    // 文章作者，类型为字符串
    author: { type: Schema.Types.ObjectId, ref: 'User' }, //文章的作者

    // 文章标签，类型为字符串
    tags: String,
    // 文章浏览量，类型为数字，默认值为 0
    views: {
        type: Number,
        default: 0
    }
}, {
    // 自动添加 createdAt 和 updatedAt 字段，记录创建时间和更新时间
    timestamps: true
});
// 这边使用virtual属性来完成对评论的列表提取，下面是对文章列表取数据的时带上评论数
ArticleSchema.virtual("coms", {
    ref: "Comment",
    localField: "_id",
    foreignField: "article_id",
    justOne: false, //取Array值- 会把文章对应的评论全部提取出来
    count: true, //取总数 如果为true 只显示数组的长度，不显示数组的内容
});
// 下面这两句只有加上了， 虚拟字段才可以显性的看到，不然只能隐性使用
ArticleSchema.set("toObject", { virtuals: true });
ArticleSchema.set("toJSON", { virtuals: true });




// 使用 ArticleSchema 创建 ArticleModel 模型，模型名为 ArticleModel 并且把表结构映射到数据库中 表名称为 Articles
//通过ArticleSchema 创建的模型，可以操作数据库中Articles表

const ArticleModel = mongoose.model('Article', ArticleSchema);



const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    nickname: String,
    headImgUrl: String,
}, {
    timestamps: true
})

const UserModel = mongoose.model('User', UserSchema);


const CommentSchema = mongoose.Schema({
    content: String,
    article_id: { type: Schema.Types.ObjectId, ref: 'Article' },
    reply_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
})
const CommentModel = mongoose.model('Comment', CommentSchema)
module.exports = {
    ArticleModel,
    UserModel,
    CommentModel
}