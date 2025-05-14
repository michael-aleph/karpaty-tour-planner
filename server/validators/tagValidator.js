const { body } = require('express-validator');

exports.validateTag = [
  body('name')
    .notEmpty().withMessage('Назва тега обовʼязкова')
    .isLength({ min: 2 }).withMessage('Назва має містити щонайменше 2 символи'),

  body('weight')
    .notEmpty().withMessage('Вага тега обовʼязкова')
    .isInt({ min: 0 }).withMessage('Вага має бути додатнім числом'),
];
