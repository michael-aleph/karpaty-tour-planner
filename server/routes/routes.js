const express = require('express');
const router = express.Router();

const { createRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute } = require('../controllers/routesController');
const { validateRoute } = require('../validators/routeValidator');
const validate = require('../middlewares/validationMiddleware');

router.get('/', getAllRoutes);
router.get('/:id', getRouteById);
router.post('/', validateRoute, validate, createRoute);
router.put('/:id', validateRoute, validate, updateRoute);
router.delete('/:id', deleteRoute);



module.exports = router;
