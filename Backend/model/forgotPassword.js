const mongoose=require('mongoose')

const Schema=mongoose.Schema

const forgotSchema=new Schema({
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