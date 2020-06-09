const express = require("express")
const app = express()
const mongoose = require("mongoose")
const userRouter = require(__dirname + "/router/user.js")
const taskRouter = require(__dirname + "/router/task.js")

mongoose.connect(process.env.DB_STRING || 'mongodb://localhost:27017/database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.listen("3000", () => console.log("server is running"))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

console.log(process.env.API_KEY);
