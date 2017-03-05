/**
 * Created by Pershing on 2017/1/26.
 */
var express=require('express');
var crypto = require('crypto');
var router=express.Router();
var User=require('../models/User');
var Sign=require('../models/Sign');
var formidable = require('formidable');
var fs = require('fs');
var data={};
var tempDir = 'public/temp/';
router.use(function (req, res, next) {
    data = {
        userInfo:req.userInfo
    }
    data.userInfo.username=decodeURI(req.userInfo.username);
    next();
});
router.get('/',function (req,res) {
    res.render('main/main',data);
})
router.get('/signs',function (req,res) {
    var cate=req.query.cate || '';
    if(cate==''|| cate=='all' || cate=='undefined'){
        Sign.find().populate({'path':'author','select':{ 'username': 1}}).sort({'_id':-1}).then(function (signs) {
            res.send(signs);
        })
    }else if(cate=='lost'){
        Sign.find({'signCategory':cate}).populate({'path':'author','select':{ 'username': 1}}).sort({'_id':-1}).then(function (signs) {
            res.send(signs);
        })
    }else if(cate=='found'){
        Sign.find({'signCategory':cate}).populate({'path':'author','select':{ 'username': 1}}).sort({'_id':-1}).then(function (signs) {
            res.send(signs);
        })
    }
})
router.get('/lost',function (req,res) {
    res.render('main/lost',data);
})
router.get('/found',function (req,res) {
    res.render('main/found',data);
})
router.get('/publish',function (req,res) {
    res.render('main/publish',data);
})
router.post('/publish',function(req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir =tempDir;     //设置临时上传目录
    form.keepExtensions = true;     //保留后缀
    form.multiples=true;//支持多文件上传
    form.maxFieldsSize =2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files) {
        var resData={
            'category':fields.category,
            'signTitle':fields.signTitle,
            'signContent':fields.signContent,
            'signName':fields.signName,
            'signWay':fields.signWay
        }
        if(resData.category=='' || resData.signTitle=='' || resData.signContent=='' || resData.signName=='' || resData.signWay==''){
            data.warning='*除图片项，其他项均不能为空！';
            res.render('main/publish',data);
            return;
        }
        if (err) {
            res.render(err);
            return;
        }
        var sign=new Sign({
            signCategory:resData.category,
            author:data.userInfo._id,
            signTitle:resData.signTitle,
            signContent:resData.signContent,
            signName:resData.signName,
            signWay:resData.signWay
        });
        if(files.signImgs.length>1&&files.signImgs.size!=0){
            for(var i=0;i<files.signImgs.length;i++){
                var extName = '';  //后缀名
                switch (files.signImgs[i].type) {
                    case 'image/pjpeg':
                        extName = 'jpg';
                        break;
                    case 'image/jpeg':
                        extName = 'jpg';
                        break;
                    case 'image/png':
                        extName = 'png';
                        break;
                    case 'image/x-png':
                        extName = 'png';
                        break;
                    default:
                        extName = '';
                        break;
                }
                if(extName== ''){
                    data.link='/publish?p=4';
                    data.messageTitle='错 误';
                    data.back='返回上一页';
                    data.message='"'+files.signImgs[i].name+'"不是png或jpg格式图片';
                    fs.unlink(files.signImgs[i].path);
                    res.render('main/panel',data);
                    return;
                }else {
                    var date=new Date();
                    var avatarName = Math.random().toString().substr(2)+date.getTime().toString()+ '.' + extName;
                    var newPath = 'public/img/upload/' + avatarName;
                    fs.renameSync(files.signImgs[i].path, newPath);  //重命名
                    sign.signImgs.push({
                        'oldname':files.signImgs[i].name,
                        'src':'/'+newPath
                    });
                }
            }
            sign.save(function (err) {
                if(err){
                    console.log(err);
                }else{
                    data.link='/publish?p=4';
                    data.back='返回上一页';
                    data.messageTitle='提 示';
                    data.message='启事发布成功';
                    res.render('main/panel',data);
                }
            });
        }else if(files.signImgs.length==undefined && files.signImgs.size!=0){
            var extName = '';  //后缀名
            switch (files.signImgs.type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
                default:
                    extName = '';
                    break;
            }
            if(extName== ''){
                data.link='/publish?p=4';
                data.back='返回上一页';
                data.message='"'+files.signImgs.name+'"不是png或jpg格式图片';
                data.messageTitle='错 误';
                fs.unlink(files.signImgs.path);
                res.render('main/panel',data);
                return;
            }else {
                var date=new Date();
                var avatarName = Math.random().toString().substr(2)+date.getTime().toString()+ '.' + extName;
                var newPath = 'public/img/upload/' + avatarName;
                fs.renameSync(files.signImgs.path, newPath);  //重命名
                sign.signImgs.push({
                    'oldname':files.signImgs.name,
                    'src':'/'+newPath
                });
                sign.save(function (err) {
                    if(err){
                        console.log(err);
                    }else{
                        data.link='/publish?p=4';
                        data.back='返回上一页';
                        data.messageTitle='提 示';
                        data.message='启事发布成功';
                        res.render('main/panel',data);
                    }
                });
            }
        }else {
            sign.signImgs.push({
                'oldname':'noPic',
                'src':"public/img/upload/noPic.jpg"
            });
            sign.save(function (err) {
                if(err){
                    console.log(err);
                }else{
                    data.link='/publish?p=4';
                    data.back='返回上一页';
                    data.messageTitle='提 示';
                    data.message='启事发布成功';
                    res.render('main/panel',data);
                }
            });
        }
    });
});
router.get('/details',function (req,res) {
    var signid=req.query.signid || '';
    if(!signid){
        data.link='/?p=0';
        data.back='返回首页';
        data.messageTitle='提 示';
        data.message='该公告不存在或已经被删除';
        res.render('main/panel',data);
        return;
    }else{
        Sign.findOne({
            _id:signid
        }).populate([{path:'signComments.comName',select:'username'},{path:'author',select:'username'}]).then(function (result) {
            data.result=result;
            res.render('main/details',data);
        })
    }
})
router.post('/details',function (req,res){
    var signid = req.body.signid || '';
    var postData = {
        comName: req.userInfo._id,
        comTime: new Date(),
        comContent: req.body.commentContent
    };
    if(postData.content==''){
        data.link='/details?p=0&signid='+signid;
        data.back='返回上一页';
        data.messageTitle='提 示';
        data.message='评论不能为空';
        res.render('main/panel',data);
        return;
    }else{
        Sign.update({'_id':signid},{$push:{"signComments":postData}}).then(function () {
            data.link='/details?p=0&signid='+signid;
            data.back='返回上一页';
            data.messageTitle='提 示';
            data.message='评论发表成功';
            res.render('main/panel',data);
        }).then(function(){
            var comid=null;
            Sign.findOne({_id:signid}).then(function (result) {
                if(result.author==req.userInfo._id){
                    return;
                }else {
                    comid=result.signComments[result.signComments.length-1]._id;
                    User.update({'_id':result.author},{$push:{"message.replyMails":{'comid':comid}},$inc:{'messageLen':1}},function (err) {
                        if(err){
                            console.log(err);
                        }
                    })
                }
            })
        })
    }
})
router.get('/mycenter',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }else {
        User.findOne({
            _id:req.userInfo._id
        },{'messageLen':1},function (err){
            if(err){
                console.log(err);
            }
        }).then(function(result){
            data.messageLen=result.messageLen;
            res.render('myCenter/centerMain',data);
        })
    }
});
router.get('/mycenter/sign_edit',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }
    var signid=req.query.signid || '';
    Sign.findOne({
        _id:signid
    },{ 'signComments': 0}).then(function (result) {
        if(result.author.toString()!==req.userInfo._id.toString()){
            data.link='/mycenter/allsigns';
            data.back='返回上一页';
            data.messageTitle='错 误';
            data.message='你并没有写过该启事';
            res.render('myCenter/warning',data);
        }else{
            data.result=result;
            res.render('myCenter/sign_edit',data);
        }
    })
});
router.get('/mycenter/psw_edit',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }
    res.render('myCenter/psw_edit',data);
});
router.post('/mycenter/psw_edit',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }
    var oldpsw=req.body.oldpsw || '';
    var newpsw1=req.body.newpsw1 || '';
    var newpsw2=req.body.newpsw2 || '';
    var loRegExp=/^(\w){6,20}$/;
    console.log(oldpsw);
    console.log(newpsw1);
    console.log(newpsw2);
    if(oldpsw=='' || newpsw1=='' || newpsw2==''){
        data.link='/mycenter/psw_edit';
        data.back='返回上一页';
        data.messageTitle='提 示';
        data.message='三项均不能为空，否则不能修改密码';
        res.render('myCenter/warning',data);
    }else if(newpsw1!==newpsw2){
        data.link='/mycenter/psw_edit';
        data.back='返回上一页';
        data.messageTitle='提 示';
        data.message='两次输入的新密码不一样';
        res.render('myCenter/warning',data);
    }else if(!loRegExp.test(newpsw1)){
        data.link='/mycenter/psw_edit';
        data.back='返回上一页';
        data.messageTitle='提 示';
        data.message='新密码必须由6-20位字母、数字、下划线组成';
        res.render('myCenter/warning',data);
    }else if(oldpsw){
        User.findOne({_id:req.userInfo._id}).then(function (result) {
            var hash = crypto.createHash('md5');
            hash.update(oldpsw);
            if(result.password!=hash.digest('hex')){
                data.link='/mycenter/psw_edit';
                data.back='返回上一页';
                data.messageTitle='提 示';
                data.message='旧密码不对，请重新输入';
                res.render('myCenter/warning',data);
            }else {
                var hash1= crypto.createHash('md5');
                hash1.update(newpsw1);
                User.update({_id:req.userInfo._id},{'password':hash1.digest('hex')}).then(function (err) {
                    data.link='/mycenter';
                    data.back='返回个人中心首页';
                    data.messageTitle='提 示';
                    data.message='密码修改成功';
                    res.render('myCenter/warning',data);
                })
            }
        })
    }
});
router.get('/mycenter/username_edit',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }
    res.render('myCenter/username_edit',data);
});
router.post('/mycenter/username_edit',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }
    var newName=req.body.newName || '';
    //判断用户名是否是正确的格式
    var reRegExp=/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,15}$/;
    if(!reRegExp.test(newName)){
        data.userInfo.username=newName;
        data.link='/mycenter/username_edit';
        data.back='返回个人中心首页';
        data.messageTitle='提 示';
        data.message='用户名必须由5-16位以字母开头、可带数字、“_”的字符组成';
        res.render('myCenter/warning',data);
        return;
    }else{
        if(newName==''){
            data.link='/mycenter/username_edit';
            data.back='返回上一页';
            data.messageTitle='提 示';
            data.message='新用户名不能为空';
            res.render('myCenter/warning',data);
        }else (
            User.update({_id:req.userInfo._id},{'username':newName}).then(function () {
                req.cookies.set('userInfo',JSON.stringify({
                    _id:req.userInfo._id,
                    username:encodeURI(newName),
                    isAdmin:req.userInfo.isAdmin
                }));
                data.userInfo.username=newName;
                data.link='/mycenter';
                data.back='返回用户名修改页';
                data.messageTitle='提 示';
                data.message='用户名修改成功';
                res.render('myCenter/warning',data);
            })
        )
    }
});
router.get('/mycenter/delsign',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }
    var signid=req.query.signid || '';
    Sign.remove({_id:signid}).then(function () {
        data.link='/mycenter/allsigns';
        data.back='返回个人中心首页';
        data.messageTitle='提 示';
        data.message='删除成功';
        res.render('myCenter/warning',data);
    })
});
router.get('/mycenter/allsigns',function (req,res) {
    if(!req.userInfo._id){
        res.send('你还没有登录，不能访问个人中心');
        return;
    }
    Sign.find({'author':req.userInfo._id}).then(function (result) {
        data.result=result;
        res.render('myCenter/allsigns',data);
    })
});
module.exports=router;