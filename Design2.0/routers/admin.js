/**
 * Created by Pershing on 2017/1/26.
 */
var express=require('express');
var router=express.Router();
var data={};
router.use(function (req, res, next) {
    data = {
        userInfo:req.userInfo
    }
    data.userInfo.username=decodeURI(req.userInfo.username);
    next();
});
router.get('/',function (req,res) {
    res.render('admin/admin_layout.html',data);
})
module.exports=router;