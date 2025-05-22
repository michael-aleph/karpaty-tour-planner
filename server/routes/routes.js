const express = require('express');
const router = express.Router();

const { createRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute } = require('../controllers/routesController');
const { validateRoute, validateRouteUpdate } = require('../validators/routeValidator');
const validationMiddleware = require('../middlewares/validationMiddleware');

router.get('/', getAllRoutes);
router.get('/:id', getRouteById);
router.post('/', validateRoute, validationMiddleware, createRoute);
router.put('/:id', validateRouteUpdate, validationMiddleware, updateRoute);
router.delete('/:id', deleteRoute);



module.exports = router;
