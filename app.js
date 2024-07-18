const express=require('express')
const mongoose=require('mongoose')


const app=express();
const PORT=process.env.PORT || 8080;

const userRoute=require('./functions/UserRoute');

app.use('/auth',userRoute);


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