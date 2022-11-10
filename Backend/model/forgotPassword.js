const mongoose=require('mongoose')

const Schema=mongoose.Schema

const forgotSchema=new Schema({
  uuid:{
    type:String,
    required:true
  },
  email:{
    type: String,
    required: true
  },
  isActive:{
    type: Boolean,
    required: true
  }
})

module.exports=mongoose.model('ForgotPassword', forgotSchema);