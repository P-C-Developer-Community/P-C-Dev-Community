const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const router = express.Router();

const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password, name, imageUrl } = req.body;


  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const defaultSocialMediaValue = "";

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`

      return User.create({ email,
        password: hashedPassword,
        name,
        imageUrl,
        twitter: defaultSocialMediaValue,
        gitHub: defaultSocialMediaValue,
        instagram: defaultSocialMediaValue,
        linkedIn: defaultSocialMediaValue,
        reviews: [] });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      
      const { email, name, _id, } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`


  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});


// GET  /auth/user  -  Used to get user that is logged in details
router.get("/user", isAuthenticated, (req, res, next) => {
  User.findById(req.payload._id)
  .then((userFromDb) => res.status(200).json(userFromDb))
  .catch((error) => res.json(error))
  
});

router.get("/community", isAuthenticated, (req, res, next) => {
  User.find()
  .populate({ 
    path: 'reviews',
    populate: {
      path: 'createdBy', 
      model: 'User' 
    }
  })
  .then((usersFromDb) => res.status(200).json(usersFromDb))
  .catch((error) => res.json(error))
  
});

// PUT /auth/user  -  Used to get user that is logged in details
router.put("/user/update", isAuthenticated, (req, res, next) => {


const {gitHub, linkedIn, twitter, instagram} = req.body;
const updates = {gitHub, linkedIn, twitter, instagram};

  User.findByIdAndUpdate(req.payload._id, updates, { new: true })
  .then((userFromDb) => {
    res.status(200).json(userFromDb)
  }
  )
  .catch((error) => res.json(error))
  
});

router.put("/user/review", isAuthenticated, (req, res, next) => {
  const review = req.body.review;
  const userId = req.body.userId;
  const createdBy = req.payload._id

  User.findByIdAndUpdate(
    userId,
    { $push: { reviews: { review: review, createdBy: createdBy } } },
    { new: true }
  )
  .populate({ 
    path: 'reviews',
    populate: {
      path: 'createdBy', 
      model: 'User' 
    }
  })
    .then((userFromDb) => {
      res.status(200).json(userFromDb);
    })
    .catch((error) => res.json(error));
});
  




module.exports = router;
