/**
 * Created by Pershing on 2016/12/28.
 */
var mongoose=require('mongoose');
var usersSchema=require('../schemas/users');

module.exports=mongoose.model('User',usersSchema);