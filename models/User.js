const mongoose=require("mongoose");

const UserSchema=mongoose.Schema({
    UserID:{
        type:Number,
        require:true,
    },
    UserFirstName:{
        type:String,
        require:true,
    },
    UserLastName:{
        type:String,
        require:true,
    },
    UserGender:{
        type:String,
        require:true,
    },
    UserEmail:{
        type:String,
        require:true,
    },
    UserDOB:{
        type:String,
        require:true,
    },
    UserImage:{
        type:String,
        require:true,
    },
    UserAuthKey:{
        type:String,
        require:true,
    },
    UserContactNumber:{
        type:String
    },
    UserZipCode:{
        type:Number
    },
    UserAlergies:{
        type:[Object]
    },
    UserPassword:{
        type:String,
        require:true,
    },
    UserFavourites:{
        type:[Object]
    },
    UserFavouriteShops:{
        type:[Object]
    },
    UserCart:{
        type:[Object]
    },
    UserAddres:{
        type:[Object]
    }

})



const Users=mongoose.model('User',UserSchema);
module.exports = Users