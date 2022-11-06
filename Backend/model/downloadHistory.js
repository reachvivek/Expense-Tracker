const mongoose=require('mongoose')

const Schema=mongoose.Schema

const downloadSchema=new Schema({
  link:{
    type: String,
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    required: true
  }
})

module.exports=mongoose.model('DownloadHistory', downloadSchema);