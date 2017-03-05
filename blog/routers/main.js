/**
 * Created by Pershing on 2016/12/28.
 */
var express=require('express');
var router=express.Router();
var User=require('../models/User');
var Category=require('../models/Category');
var Content=require('../models/Content');
var data={};
router.use(function (req, res, next) {
    data = {
        userInfo:req.userInfo
    }
    data.userInfo.username=decodeURI(req.userInfo.username);
    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});
router.get('/',function (req,res) {
    data.category = req.query.category || '';
    data.page = Number(req.query.page || 1);
    data.limit =3;
    var where={};
    if(data.category){
        where={
            category : data.category
        }

    }
    Content.where(where).count().then(function (count) {
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //取值不能小于1
        data.page = Math.max( data.page, 1 );
        var skip=(data.page-1)*data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']);
    }).then(function (contents) {
        data.contents=contents;
        res.render('main/index',data);
    });
});
router.get('/view',function (req,res) {
    var contendId=req.query.contentid || '';
    Content.findOne({
        _id:contendId
    }).populate(['category','user']).then(function (content) {
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view',data);
    })
})
router.get('/resume',function (req,res) {
        res.render('main/resume');
});
module.exports=router;