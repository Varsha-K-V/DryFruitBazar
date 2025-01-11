const User = require("../../models/userSchema");
const bcrypt = require('bcrypt');
const env=require("dotenv").config();
const nodemailer=require("nodemailer");


const pageNotFound = async (req, res) => {
  try {
    res.render("page-404");
  } catch (error) {
    res.redirect("/pageNotFound");
  }
};

const loadHomepage = async (req, res) => {
  try {
    const user = req.session.user;
    console.log(user);
    if(user){

      const userData = await User.findOne({_id:user._id});
      res.render("home",{user:userData})

    }else{
      return res.render("home");
    }
    
  } catch (error) {
    console.log("Home page not found");
    res.status(500).send("Server Error");
  }
};

const loadSignUp = async (req, res) => {
  try {
    return res.render("signup");
  } catch (error) {
    console.log("Sign up page is not loading", error);
    res.status(500).send("Server Error");
  }
};

function generateOtp(){
    return Math.floor(100000 + Math.random()*900000).toString();
}

async function sendVerificationEmail(email,otp){
    try {
        
        const transporter = nodemailer.createTransport({
            service:'gmail',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
        from:process.env.NODEMAILER_EMAIL,
        to:email,
        subject:"Verify your account",
        text:`your OTP is ${otp}`,
        html:`<b>Your OTP:${otp}</b>`,
        })

        return info.accepted.length >0


    } catch (error) {
        console.error("Error sending email",error);
        return false;
    }
}

const signup = async (req,res)=>{
    try {
      
        const {name,email,password,Cpassword,mobileNumber}=req.body;
       
        if(password!==Cpassword){
        
            return res.render("signup",{Message:"Password do not match"});
            
        }

        const findUser = await User.findOne({email})
        if(findUser){
            console.log('email exist')
            return res.render("signup",{Message:"User with this email already exists"});
        }
        

        const otp = generateOtp();

        const emailSent = await sendVerificationEmail(email,otp);
        if(!emailSent){
            return res.json("email-error")
        }

        req.session.userOTP = otp;
        console.log(req.session.userOTP);
        req.session.userData = {name,email,password,mobileNumber};
     
        res.render("otpPage");
        console.log("OTP sent",otp);

    } catch (error) {
        console.error("signup error",error);
        res.redirect("/pageNotFound")
    }
}

const loadOtp = async (req,res)=>{
    try {
         res.render("otpPage");
    } catch (error) {
        console.log("otp page not found");
        res.status(500).send("Server error");
    }
}

const securePassword = async (password)=>{
  try {
    
    const passwordHash = await bcrypt.hash(password,10)
    return passwordHash;
  } catch (error) {
    
  }
}

const otpPage = async (req,res)=>{
  try {

    const {otp}= req.body;

    console.log(otp);

    if(otp===req.session.userOTP){
      const user= req.session.userData
      const passwordHash = await securePassword(user.password);

      const saveUserData = new User({
        name:user.name,
        email:user.email,
        mobileNumber:user.mobileNumber,
        password:passwordHash,
      })

      await saveUserData.save();
      req.session.user = saveUserData._id;
      res.json({success:true, redirectUrl:"/"})
    }else {
      res.status(400).json({success:false, Message:"Invalid OTP, Please try again"})
    }
    
  } catch (error) {
    console.error("Error verifying OTP",error);
    res.status(500).json({success:false,Message:"An error occured"})
  }
} 


const resendOTP = async (req,res)=>{
  
  try {
      console.log("resend")
    const {email}=req.session.userData;
    if(!email){
      return res.status(400).json({success:false,Message:"Email not found in session"})
    }

    const otp = generateOtp();
    req.session.userOTP = otp;

    const emailSent = await sendVerificationEmail(email,otp);
    if(emailSent){
      console.log("Resend OTP:",otp);
      res.status(200).json({success:true,message:"OTP Resend Successfully"});
    }else{
      res.status(500).json({success:false,message:"Failed to resend OTP.Please try again."});
    }
  } catch (error) {
    console.error("Error resending OTP",error);
    res.status(500).json({success:false,message:"Internal Server Error. Please try again"})
  }
};


const loadLogin= async (req,res)=>{
  try {
    
    if(!req.session.user){
      return res.render("login")
    }else{
      res.redirect('/')
    }
  } catch (error) {
    res.redirect("/pageNotFound")
  }
};


const login = async (req,res)=>{

  try {

    const {email,password} = req.body;

    const findUser = await User.findOne({is_admin:false,email:email});
    

    if(!findUser){
      return res.render("login",{message:"User not found"});
    }
    if(findUser.is_Blocked){
      return res.render("login",{message:"User is blocked by admin"});
    }

    const passwordMatch = await bcrypt.compare(password,findUser.password);
    if(!passwordMatch){
      return res.render("login",{message:"Incorrect Password"})
    }

    req.session.user = findUser;
    console.log(req.session.user)
    res.redirect("/")
  } catch (error) {
      console.error("login error",error);
      res.render("login",{message:"login failed. Please try again later"})
    
  }
};

const logout = async (req,res)=>{
  try {
    
    req.session.destroy((err)=>{
      if(err){
        console.log("Session destruction error",err.message);
        return res.redirect("/pageNotFound");
      }
    })

  } catch (error) {
    
  }
}








module.exports = {
  loadHomepage,
  pageNotFound,
  loadSignUp,
  signup,
  loadOtp,
  otpPage,
  resendOTP,
  loadLogin,
  login,
  logout
};
