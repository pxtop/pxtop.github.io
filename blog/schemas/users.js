/**
 * Created by Pershing on 2016/12/28.
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
        //是否是管理员
        isAdmin:{
            type:Boolean,
            default:false
        }
    }
);