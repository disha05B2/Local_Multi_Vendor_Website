var express = require('express');
var router = express.Router();
var passport = require('passport');
require('dotenv').config("../.env");
const multer = require('multer');
const path = require('path');
const Vendor = require('../models/vendorSchema'); // Adjust the path to your Vendor model

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

// Route for login
router.route('/login')
  .get(async (req, res) => {
    res.render('login', { title: 'Login' });
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/users/login'
  }), async (req, res) => {
    res.redirect('/');
  });

// Route for register
router.route('/register')
  .get(async (req, res) => {
    res.render('register', { title: 'Register' });
  })
  .post(upload.single('idapp'), async (req, res) => {
    try {
      // Get the file path
      const filePath = req.file.path;

      // Create new vendor with the uploaded file path
      var newVendor = new Vendor({
        name: req.body.name,
        address: {
          address_line1: req.body.address_line1,
          address_line2: req.body.address_line2,
          city: req.body.city,
          pincode: req.body.pincode,
          state: req.body.state,
          country: req.body.country
        },
        email: req.body.email,
        contact: req.body.contact,
        identity_document: filePath // Store the file path
      });

      // Save the new vendor
      await newVendor.save();
      newVendor.setPassword(req.body.pwd);
      await newVendor.save();

      // Redirect to login page
      res.redirect('/users/login');
    } catch (err) {
      // Handle any errors that occur
      console.error('Error:', err);
      res.status(500).send('An error occurred');
    }
  });

// Route for logout
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
