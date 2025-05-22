const { body } = require('express-validator');

// 🔹 Для створення
exports.validateTag = [
  body('name_ua')
    .notEmpty().withMessage('Назва українською обовʼязкова')
    .isLength({ min: 2 }).withMessage('Назва має містити щонайменше 2 символи'),

  body('name_en')
    .notEmpty().withMessage('Назва англійською обовʼязкова')
    .isLength({ min: 2 }).withMessage('Назва має містити щонайменше 2 символи'),

  body('weight')
    .notEmpty().withMessage('Вага тега обовʼязкова')
    .isInt({ min: 1 }).withMessage('Вага має бути цілим числом від 1'),
];

// 🔹 Для оновлення
exports.validateTagUpdate = [
  body('name_ua')
    .optional({ checkFalsy: true })
    .isLength({ min: 2 }).withMessage('Назва має містити щонайменше 2 символи'),

  body('name_en')
    .optional({ checkFalsy: true })
    .isLength({ min: 2 }).withMessage('Назва має містити щонайменше 2 символи'),

  body('weight')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Вага має бути цілим числом від 1'),
];
