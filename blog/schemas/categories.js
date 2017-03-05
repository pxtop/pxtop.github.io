/**
 * Created by Pershing on 2016/12/31.
 */
var mongoose=require('mongoose');
//定义分类表结构
module.exports=new mongoose.Schema(
    {
        //类名
        name:{
            type:String,
            default:''
        }
    }
);