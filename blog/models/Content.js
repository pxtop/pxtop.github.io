/**
 * Created by Pershing on 2017/1/1.
 */
var mongoose=require('mongoose');
var contentsSchema=require('../schemas/contents');

module.exports=mongoose.model('Content',contentsSchema);