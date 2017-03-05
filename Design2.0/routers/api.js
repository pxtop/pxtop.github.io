/**
 * Created by Pershing on 2017/1/26.
 */
var express=require('express');
var Users=require('../models/User');
var crypto = require('crypto');
var router=express.Router();
router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    };
    next();
});
router.get('/login',function (req,res) {
    res.render('main/login');
})
router.post('/user/register',function (req,res,next) {
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;
    //判断用户名是否是正确的格式
    var reRegExp=/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,15}$/;
    var loRegExp=/^(\w){6,20}$/;
    if(!reRegExp.test(username)){
        responseData.code=1;
        responseData.message='*用户名必须由5-16位以字母开头、可带数字、“_”的字符组成';
        res.json(responseData);
        return;
    }
    //判断密码是否是正确的格式
    if(!loRegExp.test(password)){
        responseData.code=2;
        responseData.message='*密码必须由6-20位字母、数字、下划线组成';
        res.json(responseData);
        return;
    }
    //判断两次密码是否输入一致
    if(repassword!==password){
        responseData.code=3;
        responseData.message='*两次密码输入不一致';
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
            var hash = crypto.createHash('md5');
            hash.update(password);
            var user=new Users({
                username:username.toString(),
                password:hash.digest('hex')
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
    var hash = crypto.createHash('md5');
    hash.update(password);
    Users.findOne({
        username:username,
        password:hash.digest('hex')
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
            }),{maxAge:604800000});
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
module.exports=router;