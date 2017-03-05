/**
 * Created by Pershing on 2017/2/4.
 */
var mongoose=require('mongoose');
//定义用户表结构
module.exports=new mongoose.Schema(
    {
        //启事分类
        signCategory:{
            type:String,
            default:''
        },
        //启事标题
        signTitle:{
            type:String,
            default:''
        },
        //启事内容
        signContent:{
            type:String,
            default:''
        },
        //启事联系人
        signName:{
            type:String,
            default:''
        },
        //启事联系方式
        signWay:{
            type:String,
            default:''
        },
        //启事阅读数
        views:{
            type:Number,
            default:0
        },
        //启事作者
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        //启事图片
        signImgs:{
            type: Array,
            default: []
        },
        signComments:[{
            comName:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            comContent:{
                type:String
            },
            comTime:{
                type:Date
            }
        }],
        //启事添加时间
        signTime:{
            type:Date,
            default:new Date()
        }
    }
);