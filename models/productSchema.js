const mongoose=require("mongoose");
const {schema}=mongoose;

const productSchema = new Schema({
    productName:{
        type : String,
        required:true
    },
    description:{
        type : String,
        required:true
    },
    // brand:{
    //     type:String,
    //     required:true
    // },
    
        category :{
            type:Schema.Types.ObjectId,
            ref:"Category",
            required:true,
        },
        regularPrice:{
            type:Number,
            required:true,
        },
        saleprice:{
            type:Number,
            required:true,
        },
        productOffer:{
            type:Number,
            default:0,
        },
        quantity:{
            type:Number,
            default:true,
        },
        color:{
            type:String,
            required:true,
        },
        productImage:{
            type:[String],
            required:true
        },
        isBlocked:{
            type:Boolean,
            default:false,
        },
        status:{
            type:String,
            enum:["Available","out of stock","Discounted"],
            required:true,
            default:"Available"
        },
    },{Timestamp:true});

    const product =mongoose.model("product",productSchema);
    module.exports=product;



