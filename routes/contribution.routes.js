const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Contribution = require("../models/Contribution.model");

//  POST /api/projects  -  Creates a new project
router.post("/contribution", (req, res, next) => {
  const { title, description } = req.body;

  Project.create({ title, description })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/projects -  Retrieves all of the projects
router.get("/contribution", (req, res, next) => {
  Project.find()
    .then((allContribution) => res.json(allContributions))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/contributions/:contributionId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contributionId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }


  Project.findById(contributionId)
    .then((project) => res.status(200).json(contribution))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/contributions/:contributionId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contributionId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(contributionId, req.body, { new: true })
    .then((updatedContribution) => res.json(updatedContribution))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/contributions/:contributionId", (req, res, next) => {
  const { contributionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contributionId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(contributionId)
    .then(() =>
      res.json({
        message: `Project with ${contributionId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
