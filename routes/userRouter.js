const express=require("express");
const router =express.Router();
const userController = require("../controllers/user/userController");
const passport = require("passport");

router.use(express.static('public'))
router.get("/pageNotFound",userController.pageNotFound);
router.get("/",userController.loadHomepage);
router.get("/signup",userController.loadSignUp);
router.post("/signup",userController.signup)
router.get("/otpPage",userController.loadOtp);
router.post("/otpPage",userController.otpPage);
router.post("/resendOtp",userController.resendOTP);


router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    req.session.user=req.user
    return res.redirect('/')
});

// router.get("/auth/google",passport.authenticate("google",{scope:['profile','email']}))
//  router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
//     res.redirect('/')
//  });

router.get("/login",userController.loadLogin);
router.post("/login",userController.login);
router.get("/logout",userController.logout);

module.exports = router;

