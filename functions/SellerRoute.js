const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const path = require("path");

const multer = require("multer");

// const Seller=require('../models/Seller');
const Seller = require("../models/Seller");
const fileUpload = require("../middleware/fileUpload");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./SellerUploads/");
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  dest: "/app/SellerUploads/",
  limits: { fileSize: 1024 * 1024 * 2 },
  storage: storage,
});

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

router.post(
  "/insert",
  bodyParser.json(),
  upload.single("shopImage"),
  async (req, res) => {
    /*
      status:102 - server error
      status:103 -success ->> authkey
      status:104 - user exists
  */
    const Email = req.body.ShopEmail;

    try {
      await Seller.find({ shopEmail: Email }).then(async (user) => {
        if (user.length > 0) {
          res.status(201).json({ status: 104, msg: "User Exists" });
        } else {
          const authkey = await authGen();

          const newSeller = new Seller({
            shopID: req.body.shopID,
            shopName: req.body.shopName,
            shopEmail: req.body.shopEmail,
            shopAuthKey: authkey,
            shopPassword: req.body.shopPassword,
            shopZipCode: req.body.shopZipCode,
            shopDesc: req.body.shopDesc,
            shopLocation: req.body.shopLocation,
            shopAddress: req.body.shopAddress,
            shopImage: "",
            shopContactNumber: req.body.shopContactNumber,
            shopCertificates: [],
            shopReports: [],
            shopRatings: [],
          });

          if (req.file) {
            newSeller.shopImage = req.file.path;
          } else {
            newSeller.shopImage =
              "https://pluspng.com/img-png/shop-png-black-and-white-shop-icon-it-s-an-icon-for-finding-local-shopping-the-logo-is-a-square-png-50-px-1600.png";
          }

          await newSeller
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
  }
);

//Check user / Login
router.post("/login", bodyParser.json(), async (req, res) => {
  const Email = req.body.shopEmail;
  const Password = req.body.shopPassword;

  /*
      {
          status:101 - no users
          status:102 - server error
          status:103 - success    ->> authkey
          status:104 - password wrong    
  
      }
   */

  await Seller.find({ shopEmail: Email })
    .then(async (user) => {
      if (user.length > 0) {
        if (user[0].shopPassword == Password) {
          // const key=await authGen();
          res.json({ status: 103, authKey: user[0].shopAuthKey });
        } else {
          res.json({ status: 104, msg: "Password wrong" });
        }
      } else {
        res.json({ status: 101, msg: "No user" });
      }
    })
    .catch((value) => {
      res.status(501).json({ status: 102, msg: "Server error" });
    });
});

router.post("/getuserbyid", bodyParser.json(), async (req, res) => {
  const Email = req.body.shopEmail;
  const authKey = req.body.shopAuthKey;

  if (!Email && !authKey) {
    res.json({ status: 101, msg: "Parameters required" });
  } else {
    await Seller.find({ shopEmail: Email, shopAuthKey: authKey })
      .then(async (user) => {
        if (user.length > 0) {
          var simpUser = {
            shopID: user[0].shopID,
            shopName: user[0].shopName,
            shopEmail: user[0].shopEmail,
            shopZipCode: user[0].shopZipCode,
            shopDesc: user[0].shopDesc,
            shopLocation: user[0].shopLocation,
            shopAddress: user[0].shopAddress,
            shopImage: user[0].shopImage,
            shopContactNumber: user[0].shopContactNumber,
            shopCertificates: user[0].shopCertificates,
            shopReports: user[0].shopReports,
            shopRatings: user[0].shopRatings,
          };
          res.json({ status: 103, user: simpUser });
        } else {
          res.json({ status: 101, msg: "No user" });
        }
      })
      .catch((value) => {
        res.json({ status: 101, msg: "something went wrong" });
      });
  }
});




const updateFunc = async (updateType, updateData, shopEmail, UserAuth) => {
  
};

router.post("/update", bodyParser.json(), async (req, res) => {
  const shopEmail = req.body.shopEmail;
  const UserAuth = req.body.shopAuthKey;
  const updateType = req.body.updateType;
  const updateData = req.body.updateData;
  

  if (!shopEmail && !UserAuth) {
    res.json({ status: 101, msg: "Parameters required" });
  } else {
    await Seller.find({ shopEmail: shopEmail, shopAuthKey: UserAuth }).then(
      async (seller) => {
        if (seller.length > 0) {
          switch (updateType) {
            case "shopAddress":
              await Seller.findOneAndUpdate(
                { shopEmail: shopEmail},
                {
                  shopID: seller[0].shopID,
                  shopName: seller[0].shopName,
                  shopEmail: seller[0].shopEmail,
                  shopZipCode: seller[0].shopZipCode,
                  shopDesc: seller[0].shopDesc,
                  shopLocation: seller[0].shopLocation,
                  shopAddress: updateData,
                  shopImage: seller[0].shopImage,
                  shopContactNumber: seller[0].shopContactNumber,
                  shopCertificates: seller[0].shopCertificates,
                  shopReports: seller[0].shopReports,
                  shopRatings: seller[0].shopRatings,
                  shopPassword: seller[0].shopPassword,
                  shopAuthKey: seller[0].shopAuthKey
                },
                {new:true}
              )
                .then(() =>res.json({ status: 103, msg: "Successfully Updated" }))
                .catch(() =>res.json({ status: 101, msg: "something went wrong" }));
              
              break;
            case "shopName":
              await Seller.findOneAndUpdate(
                { shopEmail: shopEmail},
                {
                  shopID: seller[0].shopID,
                  shopName: updateData,
                  shopEmail: seller[0].shopEmail,
                  shopZipCode: seller[0].shopZipCode,
                  shopDesc: seller[0].shopDesc,
                  shopLocation: seller[0].shopLocation,
                  shopAddress: seller[0].shopAddress,
                  shopImage: seller[0].shopImage,
                  shopContactNumber: seller[0].shopContactNumber,
                  shopCertificates: seller[0].shopCertificates,
                  shopReports: seller[0].shopReports,
                  shopRatings: seller[0].shopRatings,
                  shopPassword: seller[0].shopPassword,
                  shopAuthKey: seller[0].shopAuthKey
                },
                {new:true}
              )
                .then(() =>res.json({ status: 103, msg: "Successfully Updated" }))
                .catch(() =>res.json({ status: 101, msg: "something went wrong" }));
              break;
            case "shopLocation":
              await Seller.findOneAndUpdate(
                { shopEmail: shopEmail},
                {
                  shopID: seller[0].shopID,
                  shopName: seller[0].shopName,
                  shopEmail: seller[0].shopEmail,
                  shopZipCode: seller[0].shopZipCode,
                  shopDesc: seller[0].shopDesc,
                  shopLocation: updateData,
                  shopAddress: seller[0].shopAddress,
                  shopImage: seller[0].shopImage,
                  shopContactNumber: seller[0].shopContactNumber,
                  shopCertificates: seller[0].shopCertificates,
                  shopReports: seller[0].shopReports,
                  shopRatings: seller[0].shopRatings,
                  shopPassword: seller[0].shopPassword,
                  shopAuthKey: seller[0].shopAuthKey
                },
                {new:true}
              )
                .then(() =>res.json({ status: 103, msg: "Successfully Updated" }))
                .catch(() =>res.json({ status: 101, msg: "something went wrong" }));
              
              break;
            
            case "shopZipCode":
              await Seller.findOneAndUpdate(
                { shopEmail: shopEmail},
                {
                  shopID: seller[0].shopID,
                  shopName: seller[0].shopName,
                  shopEmail: seller[0].shopEmail,
                  shopZipCode: updateData,
                  shopDesc: seller[0].shopDesc,
                  shopLocation: seller[0].shopLocation,
                  shopAddress: seller[0].shopAddress,
                  shopImage: seller[0].shopImage,
                  shopContactNumber: seller[0].shopContactNumber,
                  shopCertificates: seller[0].shopCertificates,
                  shopReports: seller[0].shopReports,
                  shopRatings: seller[0].shopRatings,
                  shopPassword: seller[0].shopPassword,
                  shopAuthKey: seller[0].shopAuthKey
                },
                {new:true}
              )
                .then(() =>res.json({ status: 103, msg: "Successfully Updated" }))
                .catch(() =>res.json({ status: 101, msg: "something went wrong" }));
              
              break;
            case "shopContactNumber":
              await Seller.findOneAndUpdate(
                { shopEmail: shopEmail},
                {
                  shopID: seller[0].shopID,
                  shopName: seller[0].shopName,
                  shopEmail: seller[0].shopEmail,
                  shopZipCode: seller[0].shopZipCode,
                  shopDesc: seller[0].shopDesc,
                  shopLocation: seller[0].shopLocation,
                  shopAddress: seller[0].shopAddress,
                  shopImage: seller[0].shopImage,
                  shopContactNumber: updateData,
                  shopCertificates: seller[0].shopCertificates,
                  shopReports: seller[0].shopReports,
                  shopRatings: seller[0].shopRatings,
                  shopPassword: seller[0].shopPassword,
                  shopAuthKey: seller[0].shopAuthKey
                },
                {new:true}
              )
                .then(() =>res.json({ status: 103, msg: "Successfully Updated" }))
                .catch(() =>res.json({ status: 101, msg: "something went wrong" }));
              
              break;
  
              case "shopPassword":
              await Seller.findOneAndUpdate(
                { shopEmail: shopEmail},
                {
                  shopID: seller[0].shopID,
                  shopName: seller[0].shopName,
                  shopEmail: seller[0].shopEmail,
                  shopZipCode: seller[0].shopZipCode,
                  shopDesc: seller[0].shopDesc,
                  shopLocation: seller[0].shopLocation,
                  shopAddress: seller[0].shopAddress,
                  shopImage: seller[0].shopImage,
                  shopContactNumber: seller[0].shopContactNumber,
                  shopCertificates: seller[0].shopCertificates,
                  shopReports: seller[0].shopReports,
                  shopRatings: seller[0].shopRatings,
                  shopPassword: updateData,
                  shopAuthKey: seller[0].shopAuthKey
                },
                {new:true}
              )
                .then(() =>res.json({ status: 103, msg: "Successfully Updated" }))
                .catch(() =>res.json({ status: 101, msg: "something went wrong" }));
              
              break;
          }
        } else {
          res.json({ status: 101, msg: "No users found" });
        }
      }
    );
  }
});

module.exports = router;
