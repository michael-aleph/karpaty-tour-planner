const pool = require('../db');

// Створення нового маршруту з places
exports.createRoute = async (req, res, next) => {
  const {
    name_ua,
    name_en,
    description_ua,
    description_en,
    duration_days,
    budget_min,
    budget_max,
    image_url,
    content_ua,
    content_en,
    places,
    tags
  } = req.body;

  const client = await pool.connect(); // починаємо транзакцію

  try {
    await client.query('BEGIN'); // 1. старт транзакції

    const result = await client.query(
      `INSERT INTO routes
      (name_ua, name_en, description_ua, description_en, duration_days, budget_min, budget_max, image_url, content_ua, content_en)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name_ua,
        name_en,
        description_ua,
        description_en,
        duration_days,
        budget_min,
        budget_max,
        image_url,
        content_ua,
        content_en
      ]
    );

    const newRoute = result.rows[0];

    if (Array.isArray(places)) {
      for (let i = 0; i < places.length; i++) {
        const placeId = places[i];

        // Перевірка чи існує place
        const placeCheck = await client.query('SELECT id FROM places WHERE id = $1', [placeId]);
        if (placeCheck.rows.length === 0) {
          throw { status: 400, message: `Місце з ID ${placeId} не існує` };
        }

        await client.query(
          `INSERT INTO route_places (route_id, place_id, place_order)
           VALUES ($1, $2, $3)`,
          [newRoute.id, placeId, i + 1]
        );
      }
    }

    if (Array.isArray(tags)) {
      for (let tagId of tags) {
        const tagCheck = await client.query('SELECT id FROM tags WHERE id = $1', [tagId]);
        if (tagCheck.rows.length === 0) {
          throw { status: 400, message: `Тег з ID ${tagId} не існує` };
        }

        await client.query(
          `INSERT INTO route_tags (route_id, tag_id)
           VALUES ($1, $2)`,
          [newRoute.id, tagId]
        );
      }
    }

    await client.query('COMMIT'); // 2. фіксуємо транзакцію

    res.status(201).json({
      message: 'Маршрут створено успішно',
      data: newRoute,
    });
  } catch (error) {
    await client.query('ROLLBACK'); // 3. відкат у разі помилки

    if (error.status === 400) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  } finally {
    client.release(); // обовʼязково!
  }
};


// Get all routes
exports.getAllRoutes = async (req, res, next) => {
  try {
    const { tags, duration, budget_min, budget_max, search } = req.query;

    let baseQuery = `SELECT DISTINCT r.*
                     FROM routes r`;
    const params = [];
    const conditions = [];

    // 🔹 Фільтрація по тегах
    if (tags) {
      const tagIds = tags.split(',').map(id => parseInt(id)).filter(Boolean);

      if (tagIds.length > 0) {
        baseQuery += `
          JOIN route_tags rt ON rt.route_id = r.id`;
        conditions.push(`
          r.id IN (
            SELECT route_id
            FROM route_tags
            WHERE tag_id = ANY($${params.length + 1})
            GROUP BY route_id
            HAVING COUNT(DISTINCT tag_id) = $${params.length + 2}
          )`);
        params.push(tagIds, tagIds.length);
      }
    }

    // 🔹 Фільтрація по тривалості
    if (duration) {
      conditions.push(`r.duration_days = $${params.length + 1}`);
      params.push(parseInt(duration));
    }

    // 🔹 Фільтрація по бюджету
    if (budget_min) {
      conditions.push(`r.budget_max >= $${params.length + 1}`);
      params.push(parseInt(budget_min));
    }

    if (budget_max) {
      conditions.push(`r.budget_min <= $${params.length + 1}`);
      params.push(parseInt(budget_max));
    }

    // 🔹 Пошук по назві
    if (search) {
      conditions.push(`(LOWER(r.name_ua) LIKE LOWER($${params.length + 1}) OR LOWER(r.name_en) LIKE LOWER($${params.length + 1}))`);
      params.push(`%${search}%`);
    }

    // 🔹 Додаємо WHERE, якщо є умови
    if (conditions.length > 0) {
      baseQuery += ` WHERE ` + conditions.join(' AND ');
    }

    // 🔹 Сортування — наприклад, за id
    baseQuery += ` ORDER BY r.id`;

    console.log('SQL:', baseQuery);
    console.log('PARAMS:', params);

    const result = await pool.query(baseQuery, params);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};


// Get route by ID з places та tags
exports.getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const routeResult = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    if (routeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Маршрут не знайдено' });
    }

    const placesResult = await pool.query(
      `SELECT p.*, rp.place_order
       FROM route_places rp
       JOIN places p ON p.id = rp.place_id
       WHERE rp.route_id = $1
       ORDER BY rp.place_order`,
      [id]
    );

    const tagsResult = await pool.query(
      `SELECT t.*
       FROM route_tags rt
       JOIN tags t ON t.id = rt.tag_id
       WHERE rt.route_id = $1`,
      [id]
    );

    const route = routeResult.rows[0];
    route.places = placesResult.rows;
    route.tags = tagsResult.rows;

    res.json(route);
  } catch (err) {
    next(err);
  }
};


// Update route
exports.updateRoute = async (req, res, next) => {
  const { id } = req.params;
  const {
    name_ua,
    name_en,
    description_ua,
    description_en,
    duration_days,
    budget_min,
    budget_max,
    image_url,
    content_ua,
    content_en,
    places,
    tags // додано
  } = req.body;

  // Видалити порожні рядки, щоб не затерти поля пустотою
  for (let key in req.body) {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const currentRoute = await client.query('SELECT * FROM routes WHERE id = $1', [id]);
    if (currentRoute.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Маршрут не знайдено' });
    }

    const existing = currentRoute.rows[0];


    // 🔹 Взяти або нове значення, або залишити старе
    const updatedRoute = {
      name_ua: req.body.name_ua ?? existing.name_ua,
      name_en: req.body.name_en ?? existing.name_en,
      description_ua: req.body.description_ua ?? existing.description_ua,
      description_en: req.body.description_en ?? existing.description_en,
      duration_days: req.body.duration_days ?? existing.duration_days,
      budget_min: req.body.budget_min ?? existing.budget_min,
      budget_max: req.body.budget_max ?? existing.budget_max,
      image_url: req.body.image_url ?? existing.image_url,
      content_ua: req.body.content_ua ?? existing.content_ua,
      content_en: req.body.content_en ?? existing.content_en,
    };

    const result = await client.query(
      `UPDATE routes
      SET name_ua = $1,
          name_en = $2,
          description_ua = $3,
          description_en = $4,
          duration_days = $5,
          budget_min = $6,
          budget_max = $7,
          image_url = $8,
          content_ua = $9,
          content_en = $10
      WHERE id = $11
      RETURNING *`,
      [
        updatedRoute.name_ua,
        updatedRoute.name_en,
        updatedRoute.description_ua,
        updatedRoute.description_en,
        updatedRoute.duration_days,
        updatedRoute.budget_min,
        updatedRoute.budget_max,
        updatedRoute.image_url,
        updatedRoute.content_ua,
        updatedRoute.content_en,
        id
      ]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Маршрут не знайдено' });
    }

    // 🧹 Видалити старі places
    await client.query('DELETE FROM route_places WHERE route_id = $1', [id]);

    // ➕ Додати нові places з перевіркою
    if (Array.isArray(places)) {
      for (let i = 0; i < places.length; i++) {
        const placeId = places[i];

        const placeCheck = await client.query('SELECT id FROM places WHERE id = $1', [placeId]);
        if (placeCheck.rows.length === 0) {
          throw { status: 400, message: `Місце з ID ${placeId} не існує` };
        }

        await client.query(
          `INSERT INTO route_places (route_id, place_id, place_order)
           VALUES ($1, $2, $3)`,
          [id, placeId, i + 1]
        );
      }
    }

    // 🧹 Видалити старі теги
    await client.query('DELETE FROM route_tags WHERE route_id = $1', [id]);

    // ➕ Додати нові теги з перевіркою
    if (Array.isArray(tags)) {
      for (let tagId of tags) {
        const tagCheck = await client.query('SELECT id FROM tags WHERE id = $1', [tagId]);
        if (tagCheck.rows.length === 0) {
          throw { status: 400, message: `Тег з ID ${tagId} не існує` };
        }

        await client.query(
          `INSERT INTO route_tags (route_id, tag_id)
           VALUES ($1, $2)`,
          [id, tagId]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      message: 'Маршрут оновлено успішно',
      data: result.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.status === 400) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  } finally {
    client.release();
  }
};

// Delete route
exports.deleteRoute = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Маршрут не знайдено для видалення' });
    }

    res.json({ message: 'Маршрут успішно видалено', deleted: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
