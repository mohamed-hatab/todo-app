//authorization middleware function as it will be used many times
// its function is to check if the sent token is verified and belongs to user in db ... then returns the token and its owner in the req body
async function auth (req, res, next) {
  try {
    const token = req.header("Authorization")
    const decoded = await jwt.verify(token, "sakalans")
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    })
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.usedToken = token
    next()
  } catch (e) {
    res.send("not authorized")
  }
}


function welcomeEmail(name,email){
  sgMail.send({
    to:email,
    from:"mohamedkratos40@gmail.com",
    subject:"welcome" + name + "to the application",
    text:"welcome to the application you will get access to bla bla bla"
  })
}

function cancelEmail(name,email){
  sgMail.send({
    to:email,
    from:"mohamedkratos40@gmail.com",
    subject:"we are sorry to know that you left us",
    text:"we need to know why did you left us so we can improve"
  })
}

module.exports = {
  welcomeEmail,
  cancelEmail,
  auth
}
