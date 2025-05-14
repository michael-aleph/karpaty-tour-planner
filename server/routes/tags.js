const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');
const { validateTag } = require('../validators/tagValidator');
const validationMiddleware = require('../middlewares/validationMiddleware');

// GET /api/tags
router.get('/', tagsController.getAllTags);

// GET /api/tags/:id
router.get('/:id', tagsController.getTagById);

// POST /api/tags
router.post('/', validateTag, validationMiddleware, tagsController.createTag);

// PUT /api/tags/:id
router.put('/:id', validateTag, validationMiddleware, tagsController.updateTag);

// DELETE /api/tags/:id
router.delete('/:id', tagsController.deleteTag);

module.exports = router;
