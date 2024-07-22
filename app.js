const express=require('express')
const mongoose=require('mongoose')


const app=express();
const PORT=process.env.PORT || 3000;

const userRoute=require('./functions/UserRoute');
const sellerRoute=require('./functions/SellerRoute');

app.use('/auth',userRoute);
app.use('/sellerauth',sellerRoute);

app.get('/SellerUploads',express.static('SellerUploads'));


const atlas="mongodb+srv://kavishkadew2001:qTteFvCppmwETk2A@food-safety.zz0vi76.mongodb.net/foodsafety";

const connectDB=async()=>{
    try {
        await mongoose.connect(atlas,{
        })
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB();
app.listen(PORT,()=>{
    console.log(`Server started in port : ${PORT}`);
})