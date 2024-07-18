const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();

const Users=require("../models/User");

function authGen() {
    const authPromise = new Promise((resolve, reject) => {
      try {
        const alp = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
        const x = 0;
        let key = "";
  
        for (let index = 0; index < 5; index++) {
          key = key + alp.charAt(Math.floor(Math.random() * alp.length));
        }
  
        key = key + Date.now();
  
        for (let index = 0; index < 5; index++) {
          key = key + alp.charAt(Math.floor(Math.random() * alp.length));
        }
  
        resolve(key);
      } catch (error) {
        reject(new Error("Promise faces a error"));
      }
    });
  
    return authPromise;
  }



  router.post("/insert", bodyParser.json(), async (req, res) => {
    /*
      status:102 - server error
      status:103 -success ->> authkey
      status:104 - user exists
  */
    const Email=req.body.UserEmail;
    
    try {
      await Users.find({ UserEmail: Email }).then(async (user) => {
        if (user.length > 0) {
            res.status(201).json({ status: 104, msg:"User Exists"});
        } else {
          const authkey = await authGen();
          var alergies=[];
          
          if(req.body.UserAlergies !== "" ){
            alergies =req.body.UserAlergies.split(",");
          }
        
          
  
          const newUser = new Users({
            UserID: req.body.UserID,
            UserFirstName: req.body.UserFirstName,
            UserLastName: req.body.UserLastName,
            UserEmail: req.body.UserEmail,
            UserAuthKey: authkey,
            UserPassword: req.body.UserPassword,
            UserGender:req.body.UserGender,
            UserDOB:req.body.UserDOB,
            UserImage:req.body.UserImage,
            UserContactNumber:req.body.UserContactNumber,

            UserAlergies:alergies,

            UserFavourites:[],
            UserFavouriteShops:[],
            UserAddres:[],
            UserCart: [],
          });
  
          await newUser
            .save()
            .then((savedUser) => {
              res.status(201).json({ status: 103, authKey: authkey });
            })
            .catch((value) => {
              console.log(value);
              res.status(500).json({ status: 102 });
            });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 102 });
    }
  });


  //Check user / Login
router.post("/login", bodyParser.json(), async (req, res) => {
    const Email = req.body.UserEmail;
    const Password = req.body.UserPassword;
  
    /*
      {
          status:101 - no users
          status:102 - server error
          status:103 - success    ->> authkey
          status:104 - password wrong    
  
      }
   */
  
    await Users.find({ UserEmail: Email })
      .then(async (user) => {
        if (user.length > 0) {
          if (user[0].UserPassword == Password) {
            // const key=await authGen();
            res.json({ status: 103, authKey: user[0].UserAuthKey });
          } else {
            res.json({ status: 104 ,msg:"Password wrong"});
          }
        } else {
          res.json({ status: 101, msg:"No user"});
        }
      })
      .catch((value) => {
        res.status(501).json({ status: 102, msg:"Server error"});
      });
  });


  module.exports = router;