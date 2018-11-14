const mongoose=require('mongoose');
const userSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String ,required:true},
    email:{type:String ,required:true},
    password:{type:String ,required:true},
    location:String,
    description:String,
    blogpost:[{type:mongoose.Schema.Types.ObjectId, ref :'Blogpost'}]
})

module.exports=mongoose.model('User',userSchema);