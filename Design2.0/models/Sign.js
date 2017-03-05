/**
 * Created by Pershing on 2017/2/4.
 */
var mongoose=require('mongoose');
var usersSchema=require('../schemas/signs');

module.exports=mongoose.model('Sign',usersSchema);