const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  name:{type:String,required:true},
  completion:{type:Boolean,required:true},
  description:{type:String},
  owner:{type:mongoose.Types.ObjectId,required:true}
},{timestamps:true})


taskSchema.method("details",function(){
  const task = this
  const details = task.toObject()

  delete details.owner
  delete details._id

  return details

})

const Task = mongoose.model("task",taskSchema)

module.exports = Task
