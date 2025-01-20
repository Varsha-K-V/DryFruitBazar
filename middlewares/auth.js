const User = require("../models/userSchema");



// const userAuth = (req,res,next)=>{
//     if(req.session.user){
//         User.findById(req.session.user)
//         .then(data=>{
//             if(data && !data.is_Blocked){
//                 next();
//             }else{
//                 res.redirect("/login")
//             }
//         })
//         .catch(error=>{
//             console.log("Error in user auth middleware");
//             res.status(500).send("Internal Server error");
//         })
//     }else{
//         res.redirect("/login")
//     }
// };


const userAuth = async (req, res, next) => {
    try {
        if (req.session.user) {
            const user = await User.findById(req.session.user);
            if (user && !user.is_Blocked) {
                return next();
            } else {
                console.log("User is either blocked or not found.");
                return res.redirect("/login"); // Consider rendering a message for clarity
            }
        } else {
            console.log("User session not found.");
            return res.redirect("/login");
        }
    } catch (error) {
        console.error("Error in userAuth middleware:", error);
        res.status(500).send("Internal Server Error");
    }
};


const adminAuth = async(req,res,next)=>{
    if (req.session.admin) {
        admin = await User.findOne({email:req.session.adminEmail,is_admin:true})
        if(admin){
            next()
        }else{
            res.redirect('/admin/login') 
        }
       
        
    } else {
        res.redirect('/admin/login')
        
    }
}
module.exports = {
    userAuth,
    adminAuth
}