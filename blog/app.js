/**
 * Created by Pershing on 2016/12/27.
 */
var express=require('express');
var swig=require('swig');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var Cookies=require('cookies');
var User=require('./models/User');
var app=express();
//设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));
//配置应用模板
//定义当前应用使用的模板引擎，第一个参数文件后缀，第二个参数处理解析模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存储的目录，第一个参数必须是views,第二个参数是目录
app.set('views','./views');
//注册模板引擎
app.set('view engine','html');
//取消模板缓存
swig.setDefaults({cache:false});
//body-parser设置
app.use(bodyParser.urlencoded({extended:true}));
//cookie设置
app.use(function (req,res,next) {
    req.cookies=new Cookies(req,res);
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));
            //获取当前登录用户的了类型是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            })
        }catch (err){
            console.log(err);
        }
    }else {
        next();
    }
})
//根据不同功能划分模块
app.use('/',require('./routers/main'));
app.use('/api',require('./routers/api'));
app.use('/admin',require('./routers/admin'));
//数据库连接
mongoose.Promise = global.Promise;//取消警告
mongoose.connect('mongodb://localhost:27017/blog',function (err) {
    if(err){
        console.log('数据库连接失败');
        console.log(err);
    }else{
        console.log('数据库连接成功');
        //监听8080端口
        app.listen(8080);
    }
})

