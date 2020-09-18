const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match.controller");

// Getting all
router.get("/", matchController.getMatches);

// Creating new
router.post("/", matchController.postMatch);

// // Getting single
// router.get('/:id', catController.getCat, (req, res) => res.json(res.cat));

// // Updating one
// router.patch('/:id', catController.getCat, catController.updateCat);

// // Deleting one
// router.delete('/:id', catController.getCat, catController.deleteCat);

module.exports = router;
