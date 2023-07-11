const Email=require('../models/email')
var nodemailer = require("nodemailer")
require("dotenv").config()

const sendEmail=async(req,res)=>{
  try {
    const data = req.body
    const payload = {
      from: req.user.email,
      to: data.to,
      subject: data.subject,
      body: data.body,
      date: new Date(),
      name: req.user.name,
      type: "sent",
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })

    var mailOptions = {
      from: req.user.email,
      to: data.to,
      subject: data.subject,
      text: data.body,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent: " + info.response)
      }
    })

    const email = await Email.create({ ...payload })
    // console.log(email)
    payload.type = "received"
    const inboxEmail = await Email.create({ ...payload })
    // console.log(inboxEmail)

    res.json("email sent successfully")
  } catch (error) {
    res.json(error.message)
  }
}

const getAllEmails = async (req, res) => {
    try {
      const { email } = req.user

      const emails = await Email.find({
        to: email,
        type: "received",
        bin: false,
      })
      //console.log(emails);
      res.json(emails)
    } catch (error) {
      res.json(error.message)
    }
}

const getInbox = async (req, res) => {
    try {
      const { email } = req.user

      const emails = await Email.find({
        to: email,
        type: "received",
        bin: false,
      })
      //console.log(emails)
      res.json(emails)
    } catch (error) {
      res.json(error.message)
    }
}

const saveDrafts = async (req, res) => {
  try {
    const data = req.body
    const payload = {
      from: req.user.email,
      to: data.to,
      subject: data.subject,
      body: data.body,
      date: new Date(),
      name: req.user.name,
      type: "draft",
    }

    const email = await Email.create({ ...payload })
    //console.log(email);
    res.json("Draft saved")
  } catch (error) {
    res.json(error.message)
  }
    
}

const getDrafts= async (req, res) => {
    try {
      const { email } = req.user

      const emails = await Email.find({
        from: email,
        type: "draft",
        bin: false,
      })
      //console.log(emails)
      res.json(emails)
    } catch (error) {
      res.json(error.message)
    }
}

const toggleStarredEmails = async (req, res) => {
  try {
    //console.log(req.body);
    await Email.updateOne(
      { _id: req.body.id },
      { $set: { starred: req.body.value } }
    )
    return res.json("Starred Updated successfully")
  } catch (error) {
    res.json(error)
  }
}

const getStarred=async(req,res)=>{
    try {
      const { email } = req.user

      const emails = await Email.find({
        $or: [
          { from: email, starred: "true", bin: false, type: "sent" },
          { to: email, starred: "true", bin: false, type: "received" },
        ],
      })
      //console.log(emails)
      res.json(emails)
    } catch (error) {
      res.json(error.message)
    }
}

const getSent=async(req,res)=>{
    try {
      const { email } = req.user

      const emails = await Email.find({ from: email, type: "sent", bin: false })
      //console.log(emails)
      res.json(emails)
    } catch (error) {
      res.json(error.message)
    }
}

const moveEmailToBin = async (req, res) => {
  try {
    //console.log(req.body)
    await Email.updateMany(
      { _id: { $in: req.body } },
      { $set: { bin: true} }
    )
    res.json("Emails deleted successfully")
  } catch (error) {
    res.json(error)
  }
}

const getBin=async(req, res)=>{
   try {
     const { email } = req.user

     const emails = await Email.find({
       $or: [
         { from: email, bin: true, type: "sent" },
         { to: email, bin: true, type: "received" },
       ],
     })
     //console.log(emails)
     res.json(emails)
   } catch (error) {
    res.json(error.message)
   }
}

const deleteBin = async (req, res)=>{
    try {
        console.log(req.body);
      await Email.deleteMany({ _id: { $in: req.body } })
      return res.json("Emails Deleted successfully")
    } catch (error) {
      res.json(error)
    }
    
}

const getUserInfo = async (req, res) => {
    try {
      //console.log(req.user);
      res.json(req.user)
    } catch (error) {
      res.json(error.message)
    }
  
}

module.exports ={
    sendEmail,
    getAllEmails,
    getInbox,
    getDrafts,
    saveDrafts,
    toggleStarredEmails,
    getStarred,
    getSent,
    moveEmailToBin,
    getBin,
    deleteBin,
    getUserInfo
}