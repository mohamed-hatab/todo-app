const express = require("express")
const router = new express.Router()
const User = require("../models/user.js")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const sharp = require("sharp")
const frequentlyUsedFunctions = require("../frequentlyUsedFunctions.js")
const welcomeEmail = frequentlyUsedFunctions.welcomeEmail
const cancelEmail = frequentlyUsedFunctions.cancelEmail
const auth = frequentlyUsedFunctions.auth


const upload = multer({
  limits:{fileSize:2000000},
  fileFilter(req,file,cb){
    const uploadedFile = file.originalname.toLowerCase()
    if(!(uploadedFile.endsWith("jpg") || uploadedFile.endsWith("jpeg") || uploadedFile.endsWith("png"))){
      return cb(new Error("uploaded avatar must be jpg or jpeg or png"))
    }
    return cb(undefined,true)
  }
})


router.post("/signup", async (req, res) => {
  try {
    var user = new User(req.body)
    await user.generatetoken() // this function generates a token and saves user
    welcomeEmail(user.name,user.email)
    res.status(200).send(user.profile())
  } catch (e) {
    res.status(400).send(e.message)
  }
})


router.post("/signin", async (req, res) => {
  try {
    const user = await User.isUser(req.body.email, req.body.password)
    await user.generatetoken()
    res.status(200).send(user.profile())
  } catch (e) {
    res.status(400).send("email or password not valid")
  }
})

router.post("/signout", auth, async (req, res) => {
  try {
    const user = req.user
    const usedToken = req.usedToken
    user.tokens.splice((user.tokens.indexOf(usedToken)), 1)
    user.save()
    res.status(200).send("Good bye")
  } catch (e) {
    res.status(400).send("bad request")
  }
})

router.post("/signout/all", auth, async (req, res) => {
  try {
    const user = req.user
    user.tokens = []
    user.save()
    res.status(200).send("Good bye , see you later")
  } catch (e) {
    res.status(400).send("bad request")
  }
})


router.post("/user/me/avatar",auth,upload.single("avatar"),async (req,res)=>{
  const customizedImage = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar = customizedImage
  req.user.save()
  res.send("image uploaded successfully")
},(error,req,res,next)=>{
  res.status(400).send(error.message)
})

router.delete("/user/me/avatar",auth,async(req,res)=>{
  req.user.avatar = undefined
  req.user.save()
  res.status(200).send("avatar deleted successfully")

})

router.get("/user/:id/avatar",async(req,res)=>{
  try{
    const user = await User.findOne({_id:req.params.id})
    if(!user || !user.avatar){throw new Error("Not found")}
    // res.set("Content-Type","image/png")
    res.send(user.avatar)
  }catch(e){
    res.status(404).send(e.message)
  }
})

module.exports = router
