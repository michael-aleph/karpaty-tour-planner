const { body } = require('express-validator');

exports.validateRoute = [
  body('name_ua')
    .notEmpty().withMessage('Назва маршруту українською обовʼязкова')
    .isLength({ min: 3 }).withMessage('Назва має містити щонайменше 3 символи'),

  body('name_en')
    .notEmpty().withMessage('Назва маршруту англійською обовʼязкова')
    .isLength({ min: 3 }).withMessage('Назва має містити щонайменше 3 символи'),

  body('description_ua')
    .optional()
    .isString().withMessage('Опис українською має бути рядком'),

  body('description_en')
    .optional()
    .isString().withMessage('Опис англійською має бути рядком'),

  body('duration_days')
    .notEmpty().withMessage('Тривалість маршруту обовʼязкова')
    .isInt({ min: 1 }).withMessage('Тривалість має бути додатним числом'),

  body('budget_min')
    .notEmpty().withMessage('Мінімальний бюджет обовʼязковий')
    .isInt({ min: 0 }).withMessage('Мінімальний бюджет має бути числом'),

  body('budget_max')
    .notEmpty().withMessage('Максимальний бюджет обовʼязковий')
    .isInt({ min: 0 }).withMessage('Максимальний бюджет має бути числом'),
];
