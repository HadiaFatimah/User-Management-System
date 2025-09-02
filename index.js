// import 
require('dotenv').config();
const express =require('express');
const mongoose =require('mongoose');
const session =require('express-session');
 const app =express();
 const PORT =process.env.PORT || 5000;
 
 //databaseconnection
 mongoose.connect(process.env.DB_URI)

 const db= mongoose.connection;
 db.on('error' ,(error) => console.log(error));
 db.once("open" ,() => console.log("Connect to the Database!"));

//middlewares

app.use(express.urlencoded({extented:false}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "mySecretKey123",  
    resave: false,
    saveUninitialized: true,
     })
);
app.use((req, res, next)=>{
    res.locals.message =req.session.message;
    delete req.session.message;
    next();
});
 
app.use('/uploads', express.static('uploads'));


// set template engine

app.set('view engine', 'ejs');

// route perfix

app.use("",require("./routes/routes"));

  
  app.listen(PORT ,()=>{
    console.log(`Server Started at http://localhost:${PORT}`);
  })