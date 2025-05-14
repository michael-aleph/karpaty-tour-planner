const express = require('express');
const router = express.Router();
const placesController = require('../controllers/placesController');
const { validatePlace } = require('../validators/placeValidator');
const validationMiddleware = require('../middlewares/validationMiddleware');

// GET /api/places
router.get('/', placesController.getAllPlaces);

// GET /api/places/:id
router.get('/:id', placesController.getPlaceById);

// POST /api/places
router.post('/', validatePlace, validationMiddleware, placesController.createPlace);

// PUT /api/places/:id
router.put('/:id', validatePlace, validationMiddleware, placesController.updatePlace);

// DELETE /api/places/:id
router.delete('/:id', placesController.deletePlace);

module.exports = router;
