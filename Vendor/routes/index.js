var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('dotenv').config("../.env");
const multer = require('multer');
const path = require('path');
const Product = require('../models/productSchema'); // Adjust the path to your Product model
const Order = require('../models/orderSchema'); // Adjust the path to your Order model

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Set the file name
  }
});

const upload = multer({ storage: storage });

// Route for home
router.get('/', async (req, res) => {
  if (req.user && req.user.isVerified) {
    const orders = await Order.find({});
    var data = [];
    var temp = {};
    for (let order of orders) {
      for (let prod of order.bill) {
        temp = {};
        temp.orderid = order._id;
        temp.productid = prod.productid;

        var ven = await Product.findOne({ _id: mongoose.Types.ObjectId(prod.productid) });
        if (ven.vendor.toString() == req.user._id.toString()) {
          if (prod.isArrived) {
            temp.sent = true;
          } else {
            temp.sent = false;
          }

          temp.pay = "Online Payment";
          if (order.paymentMethod == "COD") {
            temp.pay = "Cash-On-Delivery";
          }
          temp.time = `${order.time}`;
          temp.count = prod.count;
          data.push(temp);
        }
      }
    }

    res.render('index', { data: data });
  } else if (req.user && !req.user.isVerified) {
    res.render('verified');
  } else {
    res.redirect('/users/login');
  }
});

// Route for adding products (GET)
router.get('/addproducts', async (req, res) => {
  if (req.user && req.user.isVerified) {
    res.render('addproducts');
  } else {
    res.redirect('/users/logout');
  }
});

// Route for adding products (POST)
router.post('/addproducts', upload.single('imgfile'), async (req, res) => {
  if (req.user && req.user.isVerified) {
    try {
      // Create new product with the uploaded file path
      var newProd = new Product({
        name: req.body.name,
        model: req.body.model,
        description: req.body.desc,
        category: req.body.cat,
        image: req.file.path, // Store the file path
        price: req.body.price,
        quantity: req.body.quantity,
        vendor: req.user._id
      });

      await newProd.save();
      res.redirect('/addproducts');
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('An error occurred');
    }
  } else {
    res.redirect('/users/logout');
  }
});

// Route for updating stock (GET)
router.get('/updatestock', async (req, res) => {
  if (req.user && req.user.isVerified) {
    res.render('updatestock');
  } else {
    res.redirect('/users/logout');
  }
});

// Route for updating stock (POST)
router.post('/updatestock', async (req, res) => {
  if (req.user && req.user.isVerified) {
    await Product.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.upd), vendor: req.user._id }, { quantity: req.body.qant });
    res.redirect('/updatestock');
  } else {
    res.redirect('/users/logout');
  }
});

// Route for deleting products (GET)
router.get('/deleteproducts', async (req, res) => {
  if (req.user && req.user.isVerified) {
    res.render('deleteproducts');
  } else {
    res.redirect('/users/logout');
  }
});

// Route for deleting products (POST)
router.post('/deleteproducts', async (req, res) => {
  if (req.user && req.user.isVerified) {
    await Product.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.body.delete), vendor: req.user._id });
    res.redirect('/deleteproducts');
  } else {
    res.redirect('/users/logout');
  }
});

// Route for dispatching products
router.get('/dispatch/:oid/:pid', async (req, res) => {
  if (req.user && req.user.isVerified) {
    var order = await Order.findOne({ _id: mongoose.Types.ObjectId(req.params.oid) });
    for (let prod of order.bill) {
      if (prod.productid.toString() == req.params.pid) {
        prod.isArrived = true;
      }
    }
    await order.save();
    res.redirect('/');
  } else {
    res.redirect('/users/logout');
  }
});

module.exports = router;
