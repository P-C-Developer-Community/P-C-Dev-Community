const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const Request = require("../models/Request.model.js");


//  POST /api/requests  -  Creates a new project
router.post("/requests", isAuthenticated, (req, res, next) => {
const {message, projectInInterest,  } = req.body
const owner = req.body.owner._id
const sender = req.payload._id

    Request.create({message, projectInInterest, owner, sender })
      .then((response) => 
      console.log("this is us",response)
    //   res.json(response)
      )
      .catch((err) => res.json(err));
  });

  //  GET /api/requests -  Retrieves all of the requests
router.get("/requests", isAuthenticated, (req, res, next) => {
    const sender = req.payload._id

    console.log("we are here yayyyyyy")
    Request.find()
      .populate(["owner", "sender", "projectInInterest"])
      .then((allRequests) =>{
        console.log("allRequests",allRequests)
       
        const filteredMessages = allRequests.filter(function(message){
            return (message.owner._id == sender)
        })
        console.log("filteredMessages....", filteredMessages)
        
        res.json(filteredMessages)
      }
      )
      
      .catch((err) => res.json(err));
  });






module.exports = router;