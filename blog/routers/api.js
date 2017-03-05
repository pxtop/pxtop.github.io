/**
 * Created by Pershing on 2016/12/28.
 */
var express=require('express');
var router=express.Router();
var Users=require('../models/User');
var Content=require('../models/Content');
//统一返回格式
var responseData={
    code:0,
    message:''
};
/*router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    };
    next();
});*/

router.post('/user/register',function (req,res,next) {
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;
    //判断用户是否为空
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }
    //判断密码是否为空
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    //判断两次密码是否输入一致
    if(repassword!==password){
        responseData.code=3;
        responseData.message='两次密码输入不一致';
        res.json(responseData);
        return;
    }
    //查询待注册的用户名在数据库中是否存在
    Users.findOne({
        username:username.toString()
    }).then(function (exist) {

        if(exist){
            responseData.code=4;
            responseData.message='用户名已被占用';
            res.json(responseData);
            return Promise.reject();
        }else {
            var user=new Users({
                username:username.toString(),
                password:password
            });
            return user.save();
        };
    }).then(function (newUserInfo) {
        responseData.code=0;
        responseData.message='注册成功！';
        res.json(responseData);
    })
});
router.post('/user/login',function (req,res,next) {
    var username=req.body.username;
    var password=req.body.password;
    if(username==''  || password==''){
        responseData.code=5;
        responseData.message='用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    Users.findOne({
        username:username,
        password:password
    }).then(function (exist) {
        if(!exist){
            responseData.code=6;
            responseData.message='用户名或密码错误';
            res.json(responseData);
            return Promise.reject();
        }else {
            var newcookie=encodeURI(exist.username);
            responseData.code=0;
            responseData.message='登录成功！';
            req.cookies.set('userInfo',JSON.stringify({
                _id:exist._id,
                username:newcookie,
                isAdmin:exist.isAdmin
            }));
            responseData.userInfo={
                _id:exist._id,
                username:decodeURI(newcookie),
                isAdmin:exist.isAdmin
            }
            res.json(responseData);
        }
    })
});
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    responseData.code=99;
    res.json(responseData);
})
router.get('/comment',function (req,res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        responseData.data = content.comments;
        res.json(responseData);
    });
});
router.post('/comment/post',function (req,res) {
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };
    if(postData.content==''){
        responseData.code=7;
        responseData.message='评论为空！不能提交';
        res.json(responseData);
        return;
    }else{
        Content.findOne({
            _id: contentId
        }).then(function(content) {
            content.comments.push(postData);
            return content.save();
        }).then(function(newContent) {
            responseData.code=98;
            responseData.message = '评论成功';
            responseData.data = newContent;
            res.json(responseData);
        });
    }
})
module.exports=router;