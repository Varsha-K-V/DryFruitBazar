const mongoose=require("mongoose");
const {Schema}=mongoose;


const userSchema = new Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      mobileNumber: {
        type: Number,
        required: false,
        // unique: true,
        sparce:true,
        default:null,
      },
      email: {
        type: String,
        required: true,
        // unique: true,
        //trim: true,
        //lowercase: true,
      },
      googleId:{
        type:String,
        unique:true
      },
      password: {
        type: String,
        required: false,
        //minlength: 6, 
      },
      is_admin: {
        type: Boolean,
        default: false, 
      },
      is_Verified: {
        type: Boolean,
        default: false, 
      },
      is_Blocked: {
        type: Boolean,
        default: false, 
      },
      created_at: {
        type: Date,
        default: Date.now, 
      },
      updated_at: {
        type: Date,
        default: Date.now, 
      },
    },
    {
      timestamps: true, 
    }
)



const User=mongoose.model("User",userSchema);
module.exports=User;

