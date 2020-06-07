const sgMail = require('@sendgrid/mail');
const key = process.env.API_KEY
sgMail.setApiKey(key);

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
  cancelEmail
}
