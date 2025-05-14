const { body } = require('express-validator');

exports.validatePlace = [
  body('name_ua')
    .notEmpty().withMessage('Українська назва обовʼязкова'),

  body('name_en')
    .notEmpty().withMessage('Англійська назва обовʼязкова'),

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
