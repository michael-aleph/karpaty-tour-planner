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
  
  body('image_url')
    .optional()
    .isURL().withMessage('Посилання на зображення має бути коректним URL'),
  
  body('content_ua')
    .optional()
    .isString().withMessage('Контент українською має бути рядком'),
  
  body('content_en')
    .optional()
    .isString().withMessage('Контент англійською має бути рядком'),
];

exports.validateRouteUpdate = [
  body('name_ua')
    .optional({ checkFalsy: true }) // допускає undefined або ""
    .isLength({ min: 3 }).withMessage('Назва українською має містити щонайменше 3 символи'),

  body('name_en')
    .optional({ checkFalsy: true })
    .isLength({ min: 3 }).withMessage('Назва англійською має містити щонайменше 3 символи'),

  body('description_ua')
    .optional({ checkFalsy: true })
    .isString().withMessage('Опис українською має бути рядком'),

  body('description_en')
    .optional({ checkFalsy: true })
    .isString().withMessage('Опис англійською має бути рядком'),

  body('duration_days')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Тривалість має бути додатним числом'),

  body('budget_min')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Мінімальний бюджет має бути числом'),

  body('budget_max')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Максимальний бюджет має бути числом'),

    body('image_url')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Посилання на зображення має бути коректним URL'),
  
  body('content_ua')
    .optional({ checkFalsy: true })
    .isString().withMessage('Контент українською має бути рядком'),
  
  body('content_en')
    .optional({ checkFalsy: true })
    .isString().withMessage('Контент англійською має бути рядком'),  
];
