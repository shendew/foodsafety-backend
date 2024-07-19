const mongoose=require("mongoose");

const SellerSech=mongoose.Schema({
    shopID:{
        type:String,
        required:true
    },
    shopEmail:{
        type:String,
        required:true
    },
    shopName:{
        type:String,
        required:true
    },
    shopDesc:{
        type:String,
        
    },
    shopImage:{
        type:String,
        required:true
    },
    shopLocation:{
        type:String,
        required:true
    },
    shopAddress:{
        type:String,
        required:true
    },
    shopContactNumber:{
        type:String,
        required:true
    },
    shopCertificates:{
        type:[Object],
    },
    shopReports:{
        type:[Object],
    },
    shopPassword:{
        type:String,
        required:true
    },
    shopAuthKey:{
        type:String,
        required:true
    },
    shopZipCode:{
        type:Number,
        required:true
    },
    shopRatings:{
        type:[Object],
    },
    
    

})

const Sellers=mongoose.model('Seller',SellerSech);
module.exports = Sellers