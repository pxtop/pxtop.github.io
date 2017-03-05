/**
 * Created by Pershing on 2017/2/3.
 */
var mongoose=require('mongoose');
var usersSchema=require('../schemas/users');

module.exports=mongoose.model('User',usersSchema);