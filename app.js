

// app.js
require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const MongoDBStore = require('connect-mongodb-session')(session);
const {v4: uuidv4} = require('uuid');
const connectDB = require('./config/database');
const { encryptFunction, decryptFunction} = require('./config/hashdata');
const User = require('./model/user');
const cors = require('cors');

// const password = 'secr3t'; // user sign-up password
// const logSummary = { logID: uuidv4().toString(), recovery: password };



const app = express();
const port = process.env.PORT || 3000;


// variables
let pageName;


// Connect to MongoDB
connectDB();


// Set up session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);


// app level middleware
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));


// custom route level middleware
function isLoggedIn (req, res, next) {
  if (req.session.isAuth) {
    return next();
  }else{
    return res.redirect('/signup');
  }
}


// Routes
app.get('/', isLoggedIn, (req, res) => {
    pageName = 'HOME';
    res.render('index', { pageName });
});


//-------------------- SIGN-UP (GET method route) ----------------
app.get('/signup', (req, res) => {
  pageName = 'SIGN-UP';
  res.render('sign-up', {pageName});
});

// SIGN-UP (POST method route)
app.post('/signup', async (req, res) => {
  let logSummary
    const {username, email, password} = req.body;
  try {    
    // terminate request if email exists in Database otherwise, create a new user
    let emailExist = await User.findOne({email: email});

    if (emailExist){
        return res.status(401).send("Request terminated. Please try again later.");
    }
     
    if(!emailExist){
        // create a user in database
        const hashedPassword = bcrypt.hashSync(password, 12);
        console.log(`hashedPassword:  ${hashedPassword}`)

        /**
         * NOTE:
         * ------
         * The bcrypt.compare() method is signing-in wrong password; In a new file
         * "hashdata.js" I wrote some code using "crypto", a core nodeJS module,
         *  as backup and from it, I export encryptFunction(<arg>) & decryptFunction(<arg>),
         * import and use them in this file.
         * CHECK-OUT: "./config/hashdata.js" file for the full code.
         */

        logSummary = {logID: uuidv4().toString(), recovery: req.body.password};
        const encryptedData = encryptFunction(logSummary);

        console.log(`encryptedData:  ${encryptedData}`);

        const user = new User({ 
          username, 
          email, 
          password: hashedPassword, 
          actSummary: encryptedData 
        });

        console.log(`save user():  ${user}`);

        await user.save();
        return res.redirect('/signin');
        }
    
    }   catch (error) {
    // res.status(500).send(error.message);
    res.redirect('/signup');
  }});


//------------------ SIGN-IN (GET method route) -----------------
app.get('/signin', (req, res) => {
  pageName = 'SIGN-IN';
  res.render('sign-in', {pageName});
});

// SIGN-IN (POST method route)
app.post('/signin', async (req, res) => {
  try {
    const email = req.body.email;
    const login_password = req.body.password;
    console.log({email, login_password});
    const verify_user_byEmail = await User.findOne({ email });
    console.log(`verify_user_byEmail:  ${verify_user_byEmail}`);
    console.log(`verify_user_byEmail.email:  ${verify_user_byEmail.email}`);

    if (verify_user_byEmail.email === email) {
      req.session.isAuth = true; 

      const verifiedPassword = await bcrypt.compare(login_password, verify_user_byEmail.password);
      console.log(`verify_user_byEmail.password:  ${verify_user_byEmail.password}`);
      console.log(`verifiedPassword:  ${verifiedPassword}`);
      console.log(`verify_user_byEmail.actSummary:  ${verify_user_byEmail.actSummary}`);


      const recoveryData = verify_user_byEmail.actSummary;
      const decryptedData = decryptFunction(recoveryData);
      console.log(`decryptedData:  ${typeof decryptedData['recovery']}`);

      const recoveredPswd = JSON.parse(decryptedData);
      console.log(`recoveredPswd:  ${recoveredPswd.recovery}`);


      // if ((verifiedPassword === false) && (login_password !== verify_user_byEmail.originalpswd)) {
      if ((verifiedPassword === false) && (login_password !== recoveredPswd.recovery.toString())) {
        console.log(`both passwords didn't match`)
        return res.redirect('/signin');
      }else{
        console.log(`one of the passwords matched`);
        return res.redirect('/');
      }
    } 
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// SIGN-UP (GET method route)

// SIGN-OUT
app.post('/signout', (req, res)=>{
  console.log('signout clicked!')
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/signin");
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
