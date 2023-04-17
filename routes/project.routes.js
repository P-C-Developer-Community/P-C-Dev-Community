const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Contribution = require("../models/Contribution.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const fileUploader = require("../config/cloudinary.config");



//  POST /api/projects  -  Creates a new project
router.post("/projects",isAuthenticated , (req, res, next) => {
  const { title, description, owner, imageUrl } = req.body;

  Project.create({ title, description, owner: req.payload._id, imageUrl })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});


// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {

 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});


//  GET /api/projects -  Retrieves all of the projects
router.get("/projects", (req, res, next) => {
  Project.find()
    .populate("owner")
    .then((allProjects) =>
    res.json(allProjects))
    
    

    
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }


  Project.findById(projectId)
    
    .then((project) => res.status(200).json(project))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/projects/:projectId",isAuthenticated ,  (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then((updatedProject) => res.json(updatedProject))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/projects/:projectId",isAuthenticated , (req, res, next) => {
  const { projectId } = req.params;

  console.log("Deleting project.........")

  

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(projectId)
    .then(() =>
      res.json({
        message: `Project with ${projectId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});


router.get("/projects/search", (req, res, next) => {
  // const { searchValue } = req.params;
  console.log("thats the body.....",req.body)


  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
    // res.status(400).json({ message: "Specified Id is not valid" });
    // return;
  // }
// 
// 
  // Project.findById(projectId)
    // 
    // .then((project) => res.status(200).json(project))
    // .catch((error) => res.json(error));
});






module.exports = router;
