const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player.controller");

// Getting all
// router.get("/", playerController.getMatches);

// Creating new
router.post("/", playerController.postPlayer);

// // Getting single
// router.get('/:id', catController.getCat, (req, res) => res.json(res.cat));

// // Updating one
// router.patch('/:id', catController.getCat, catController.updateCat);

// Deleting one
router.delete("/:id", playerController.deletePlayer);

module.exports = router;
