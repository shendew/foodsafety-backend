const mongoose=require("mongoose");

const VegitableProductSchema=mongoose.Schema({

    productImage:{
        type:String,
    },
    productName:{
        type:String,
        require:true
    },
    productDescription:{
        type:String,
        require:true
    },
    productVeriety:{
        type:String,
        require:true
    },
    productStock:{
        type:Number,
        require:true
    },
    productPrice:{
        type:Number,
        require:true
    },
    productDiscount:{
        type:Number,
        require:true
    },
    productExpireDate:{
        type:Date,
        require:true
    },
    productManufactureDate:{
        type:Date,
        require:true
    },
    bulkWEight:{
        type:Number,
        require:true
    },
    nameOfFarmer:{
        type:String,
        require:true
    },
    addressOfFarmer:{
        type:String,
        require:true
    },
    mobileOfFarmer:{
        type:Number,
        require:true
    },
    cultivatedLand:{
        type:String,
        require:true
    },
    farmingPractice:{
        type:String,
        require:true
    },
    harvestedType:{
        type:String,
        require:true
    },
    maturityStage:{
        type:String,
        require:true
    },
    batchNumber:{
        type:String,
        require:true
    },
    storageTemperature:{
        type:Number,
        require:true
    },
    precoolMethod:{
        type:String,
        require:true
    },
    transportMethod:{
        type:String,
        require:true
    },
    fertilizerApplication:{
        type:[String],
        
    },
    listedDate:{
        type:Date,
        require:true
    }
})


const VegitableProduct = mongoose.model("VegitableProduct",VegitableProductSchema);
module.exports =VegitableProduct;