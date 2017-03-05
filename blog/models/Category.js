/**
 * Created by Pershing on 2016/12/31.
 */
var mongoose=require('mongoose');
var categoriesSchema=require('../schemas/categories');

module.exports=mongoose.model('Category',categoriesSchema);