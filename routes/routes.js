const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

//Insert a user into database route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file ? req.file.filename : null,
        });

        await user.save();   // ✅ ab callback ki jagah promise use hoga

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };

        res.redirect('/');
    } catch (err) {
        res.json({
            message: err.message,
            type: 'danger'
        });
    }
});


// Get all users route
router.get("/", async (req, res) => {
    try {
      const users = await User.find(); 
      res.render("index", {
        title: "Home Page",
        users: users,
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  });

  // Add user page
router.get("/add", (req, res) => {
    res.render("add_user", { title: "Add User" });
});

//Edit an user route
router.get('/edit/:id', async (req, res) => {
    try {
      let id = req.params.id;
      const user = await User.findById(id);
  
      if (!user) {
        // agar user na mile
        req.session.message = {
          type: 'danger',
          message: 'User not found!'
        };
        return res.redirect('/');
      }
  
      // agar user mila to edit page render hoga
      res.render('edit_users', {
        title: "Edit User",
        user: user,
      });
  
    } catch (err) {
      console.log(err);
      res.redirect('/');
    }
  });


// Update User Route
router.post('/update/:id', upload, async (req, res) => {
    try {
      let id = req.params.id;
      let new_image = "";
  
      if (req.file) {
        new_image = req.file.filename;
        try {
          fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch (err) {
          console.log(err);
        }
      } else {
        new_image = req.body.old_image;
      }
  
      await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
      });
  
      req.session.message = {
        type: "success",
        message: "User updated successfully!",
      };
  
      res.redirect("/");
    } catch (err) {
      res.json({
        message: err.message,
        type: "danger",
      });
    }
  });
  

// Delete user route
router.get("/delete/:id", async (req, res) => {
    try {
      let id = req.params.id;
  
      const result = await User.findByIdAndDelete(id); // ✅ modern method
  
      if (result && result.image) {
        try {
          // File ka path resolve karo
          fs.unlinkSync(path.join(__dirname, "../uploads", result.image));
        } catch (err) {
          console.log("Image delete error:", err);
        }
      }
  
      req.session.message = {
        type: "info",
        message: "User deleted successfully!",
      };
  
      res.redirect("/");
    } catch (err) {
      res.json({ message: err.message });
    }
  });
  






module.exports = router;
