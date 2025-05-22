const { body } = require('express-validator');

exports.validatePlace = [
  body('name_ua')
    .notEmpty().withMessage('Українська назва обовʼязкова')
    .isLength({ min: 3 }).withMessage('Назва має містити щонайменше 3 символи'),

  body('name_en')
    .notEmpty().withMessage('Англійська назва обовʼязкова')
    .isLength({ min: 3 }).withMessage('Назва має містити щонайменше 3 символи'),

  body('description_ua')
    .optional()
    .isString().withMessage('Опис українською має бути рядком'),

  body('description_en')
    .optional()
    .isString().withMessage('Опис англійською має бути рядком'),

  body('image_url')
    .optional()
    .isURL().withMessage('Посилання на зображення має бути валідним URL'),
];

exports.validatePlaceUpdate = [
  body('name_ua')
    .optional({ checkFalsy: true })
    .isLength({ min: 3 }).withMessage('Назва має містити щонайменше 3 символи'),

  body('name_en')
    .optional({ checkFalsy: true })
    .isLength({ min: 3 }).withMessage('Назва має містити щонайменше 3 символи'),

  body('description_ua')
    .optional({ checkFalsy: true })
    .isString().withMessage('Опис українською має бути рядком'),

  body('description_en')
    .optional({ checkFalsy: true })
    .isString().withMessage('Опис англійською має бути рядком'),

  body('image_url')
    .optional({ checkFalsy: true })
    .isURL().withMessage('image_url має бути коректним URL'),
];
