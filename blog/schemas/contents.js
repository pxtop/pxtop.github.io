/**
 * Created by Pershing on 2017/1/1.
 */
var mongoose=require('mongoose');
//定义文章内容表结构
module.exports=new mongoose.Schema(
    {
        //文章分类
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        },
        //文章作者
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        //文章添加时间
        addTime:{
            type:Date,
            default:new Date()
        },
        views:{
            type:Number,
            default:0
        },
        //文章标题
        title:{
            type:String,
            default:''
        },
        //文章简介
        description:{
            type:String,
            default:''
        },
        //文章内容
        content:{
            type:String,
            default:''
        },
        comments:
        {
            type: Array,
            default: []
        }

    }
);