const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(email) {
      if (!(validator.isEmail(email))) {
        throw new Error("email is not valid")
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(password) {
      if (password.length < 12) {
        throw new Error("password must be at least 12 character long")
      }
    }
  },
  age: {
    type: Number,
    default: 18
  },
  tokens: [{
    token: {
      type: String
    }
  }],
  avatar:{type:Buffer}

}, {
  timestamps: true
})


userSchema.method("generatetoken", async function() {
  const user = this
  const token = await jwt.sign({
    _id: user._id
  },process.env.SECRET_KEY, {
    expiresIn: "2 days"
  })
  user.tokens.push({
    token
  })
  user.save()
})

userSchema.method("profile", function() {
  const user = this
  const profile = user.toObject()

  delete profile.password
  delete profile.tokens
  delete profile._id

  return profile
})

userSchema.static("isUser", async function(email, password) {
  const user = await User.findOne({
    email
  })
  const compare = await bcrypt.compare(password, user.password)
  if (!compare) {
    throw new Error("email or password is invalid")
  }
  return user
})

userSchema.pre("save", async function(next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})


const User = mongoose.model("user", userSchema)


module.exports = User
