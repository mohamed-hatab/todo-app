const express = require("express")
const app = express()
const mongoose = require("mongoose")
const userRouter = require(__dirname + "/router/user.js")
const taskRouter = require(__dirname + "/router/task.js")

mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.listen(process.env.PORT, () => console.log("server is running"))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.git("/",()=>{res.send("hi")})

console.log(process.env.API_KEY);
