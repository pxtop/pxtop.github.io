/**
 * Created by Pershing on 2017/2/3.
 */
var mongoose=require('mongoose');
//定义用户表结构
module.exports=new mongoose.Schema(
    {
        //用户名
        username:{
            type:String,
            default:''
        },
        //密码
        password:{
            type:String,
            default:''
        },
        //注册时间
        registerTime:{
            type:Date,
            default:new Date()
        },
        //站内信息和私信
        message:{
            siteMails:[{
                sendName: String,
                sendMessage: String,
                sendTime:Date,
                siteStatus:{
                    type:Boolean,
                    default:false
                }
            }],
            replyMails:[{
                comid:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Sign'
                },
                repTime:Date,
                repStatus:{
                    type:Boolean,
                    default:false
                }
            }]
        },
        //未读信息条数
        messageLen:{
            type:Number,
            default:0
        },
        //是否是管理员
        isAdmin:{
            type:Boolean,
            default:false
        }
    }
);