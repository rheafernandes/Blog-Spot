 const mongoose=require('mongoose');
 const blogPostSchema= mongoose.Schema({
     _id:mongoose.Schema.Types.ObjectId,
     title:{type:String ,required:true},
     content:{type:String ,required:true},
     author:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
 });

 module.exports=mongoose.model('Blogpost',blogPostSchema); //Should be uppercase