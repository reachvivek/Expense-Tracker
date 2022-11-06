const mongoose=require('mongoose')

const Schema=mongoose.Schema

const expensesSchema=new Schema({
  amount:{
    type: Number,
    required: true
  },
  desc:{
    type: String,
    required: true
  },
  catg:{
    type: String,
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    required: true
  }
})

module.exports=mongoose.model('Expenses', expensesSchema);