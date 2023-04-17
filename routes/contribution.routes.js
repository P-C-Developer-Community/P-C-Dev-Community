const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const fileUploader = require("../config/cloudinary.config");

const Contribution = require("../models/Contribution.model");

//  POST /api/contributions  -  Creates a new contribution
router.post("/contributions", isAuthenticated, (req, res, next) => {
  const { title, description, imageUrl } = req.body;

  Contribution.create({ title, description, imageUrl, owner: req.payload._id, contributions: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/contributions -  Retrieves all of the contributions
router.get("/contributions", (req, res, next) => {
  Contribution.find()
    .then((allContributions) => res.json(allContributions))
    .catch((err) => res.json(err));
});

//  GET /api/contributions/:contributionId -  Retrieves a specific contribution by id
router.get("/contributions/:contributionId", (req, res, next) => {
  const { contributionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contributionId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }


  Contribution.findById(contributionId)
  .populate(["owner"])
    .then((contribution) => {
      res.status(200).json(contribution)
    })
    .catch((error) => res.json(error));
});

// PUT  /api/contributions/:contributionId  -  Updates a specific contribution by id
router.put("/contributions/:contributionId", isAuthenticated, (req, res, next) => {
  const { contributionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contributionId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Contribution.findByIdAndUpdate(contributionId, req.body, { new: true })
    .then((updatedContribution) => res.json(updatedContribution))
    .catch((error) => res.json(error));
});

// DELETE  /api/contributions/:contributionId  -  Deletes a specific contribution by id
router.delete("/contributions/:contributionId", isAuthenticated, (req, res, next) => {
  const { contributionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contributionId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Contribution.findByIdAndRemove(contributionId)
    .then(() =>
      res.json({
        message: `Project with ${contributionId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
