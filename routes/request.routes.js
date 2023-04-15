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
const isRead = false

    Request.create({message, projectInInterest, owner, sender, isRead })
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


  //  GET /api/requests/read -  Changes request status to Read
router.get("/request/read", isAuthenticated, (req, res, next) => {

    const id = req.query.id;
   
    Request.findByIdAndUpdate(id, {isRead: true}, { new: true })
      .then((updatedResponse) =>{    
        res.json(filteredMessages)
      }
      )
      .catch((err) => res.json(err));
  });


  //  GET /api/requests/delete -  Delete message
router.get("/request/delete", isAuthenticated, (req, res, next) => {

    const id = req.query.id;
   
    Request.findByIdAndRemove(id)
      .then((updatedResponse) =>{    
        res.json(filteredMessages)
      }
      )
      .catch((err) => res.json(err));
  });



module.exports = router;