/**
 * Created by Pershing on 2016/12/28.
 */
var express=require('express');
var router=express.Router();
var User=require('../models/User');
var Category=require('../models/Category');
var Content=require('../models/Content');
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send('Sorry,该界面只能由管理员进入!');
        return;
    }else{
        next();
    }
})
//后台管理首页
router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});
//后台用户管理模块
router.get('/user',function (req,res,next) {
    var page=Number(req.query.page || 1);
    var limit=2;
    var skip=(page-1)*limit;
    User.count().then(function (count) {
        var pages=Math.ceil(count/limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/users_index',{
                userInfo:req.userInfo,
                users:users,
                pages:pages,
                limit:limit,
                count:count,
                page:page,
                url:'/admin/user'
            });
        });
    })
});
router.get('/category',function (req,res,next) {
    var page=Number(req.query.page || 1);
    var limit=2;
    var skip=(page-1)*limit;
    Category.count().then(function (count) {
        var pages=Math.ceil(count/limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        Category.find().limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                pages:pages,
                limit:limit,
                count:count,
                page:page,
                url:'/admin/category'
            });
        });
    })
});
router.get('/category/add', function(req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});
router.post('/category/add',function (req,res,next) {
    var name=req.body.name || '';
    if(name==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类名称不能为空',
            back:'返回到上一页'
        });
        return;
    }else{
        Category.findOne({
            name:name
        }).then(function (rs) {
            if(rs){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'该分类已经存在',
                    back:'返回到上一页'
                });
                return  Promise.reject();
            }else{
                var category=new Category({
                    name:name
                });
                return category.save();
            }
        }).then(function (newCategory) {
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'分类保存成功',
                url:'/admin/category',
                back:'返回到分类列表页'
            });
        })
    }
});
router.get('/category/edit', function(req, res) {
    var id=req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message:'该分类不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })
});
router.post('/category/edit',function (req,res) {
    var id=req.query.id || '';
    var newname=req.body.newname || '';
    Category.findOne({
        _id:id
    }).then(function (result) {
        if(!result){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '要编辑的分类不存在'
            });
            return Promise.reject();
        }else {
            //当用户没有做任何的修改提交的时候
            if (newname == result.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '分类名称修改成功',
                    url: '/admin/category',
                    back:'返回分类列表页'
                });
                return Promise.reject();
            }else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: newname
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类中已存在该名称'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            },{
                name: newname
            });
        }
    }).then(function(rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category',
            back:'返回分类列表页'
        });
    })
});
router.get('/category/delete',function (req,res) {
    var id=req.query.id || '';
    Category.remove({
        _id:id
    }).then(function (rs) {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category',
            back:'返回分类列表页'
        })
    })
})
router.get('/content',function (req,res) {
    var page=Number(req.query.page || 1);
    var limit=2;
    var skip=(page-1)*limit;
    Content.count().then(function (count) {
        var pages=Math.ceil(count/limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        Content.find().limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                pages:pages,
                limit:limit,
                count:count,
                page:page,
                url:'/admin/content'
            });
        });
    })
})
router.get('/content/add',function (req,res) {
    Category.find().then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories:categories
        });
    })
})
router.post('/content/add', function(req, res) {

    //console.log(req.body)

    if ( req.body.category == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }

    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空',
            back:'返回上一页'
        })
        return;
    }

    //保存数据到数据库
    new Content({
        category: req.body.category,
        user:req.userInfo._id.toString(),
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content',
            back:'返回文章列表页面'
        })
    });
});

router.get('/content/edit',function (req,res) {
    var id=req.query.id || '';
    Content.findOne({
        _id:id
    }).populate('category').then(function (content) {
        if(!content){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message:'该文章不存在'
            });
            return Promise.reject();
        }else{
            Category.find().then(function (categories) {
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    categories:categories,
                    content:content
                });
            });
        }
    })
})
router.post('/content/edit',function (req,res) {
    var id=req.query.id || '';
    var newcategory=req.body.newcategory || '';
    var newtitle=req.body.newtitle || '';
    var newdescription=req.body.newdescription || '';
    var newcontent=req.body.newcontent || '';
    Content.findOne({
        _id:id
    }).then(function (result) {
        if(!result){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '要编辑的文章不存在'
            });
            return Promise.reject();
        }else {
            //当用户没有做任何的修改提交的时候
            if (newtitle == result.title && newcategory == result.category && newdescription==result.description && newcontent==result.content ) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '文章修改成功',
                    url: '/admin/content',
                    back:'返回文章列表页'
                });
                return Promise.reject();
            }else {
                return Content.update({
                    _id: id
                },{
                    category:newcategory,
                    user:req.userInfo._id.toString(),
                    title: newtitle,
                    description:newdescription,
                    content:newcontent
                });
            }
        }
    }).then(function(rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '文章修改成功',
            url: '/admin/content',
            back:'返回文章列表页'
        });
    })
});
router.get('/content/delete',function (req,res) {
    var id=req.query.id || '';
    Content.remove({
        _id:id
    }).then(function (rs) {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content',
            back:'返回文章列表页'
        })
    })
})
module.exports=router;