const pool = require('../db');

// Створення нового маршруту з places
exports.createRoute = async (req, res, next) => {
  const {
    name_ua,
    name_en,
    description_ua,
    description_en,
    duration_hours,
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
      (name_ua, name_en, description_ua, description_en, duration_hours, image_url, content_ua, content_en)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name_ua,
        name_en,
        description_ua,
        description_en,
        duration_hours,
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
    const { tags, duration_min, duration_max, search } = req.query;
    if (duration_min && duration_max && parseInt(duration_min) > parseInt(duration_max)) {
      return res.status(400).json({ message: 'Мінімальна тривалість не може бути більшою за максимальну.' });
    }
    
    const tagIds = tags ? tags.split(',').map(Number).filter(Boolean) : [];

    let userDuration = null;
    if (duration_min && duration_max) {
      userDuration = (parseInt(duration_min) + parseInt(duration_max)) / 2;
    } else if (duration_min) {
      userDuration = parseInt(duration_min);
    } else if (duration_max) {
      userDuration = parseInt(duration_max);
    }

    const params = [];
    const conditions = [];
    let baseQuery = `SELECT DISTINCT r.* FROM routes r`;
    
    // 🔹 Фільтр по тегах
    if (tagIds.length > 0) {
      baseQuery += ` JOIN route_tags rt ON rt.route_id = r.id`;
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

    // 🔹 Фільтр по тривалості
    if (duration_min) {
      conditions.push(`r.duration_hours >= $${params.length + 1}`);
      params.push(parseInt(duration_min));
    }
    
    if (duration_max) {
      conditions.push(`r.duration_hours <= $${params.length + 1}`);
      params.push(parseInt(duration_max));
    }

    // 🔹 Пошук по назві
    if (search) {
      conditions.push(`(LOWER(r.name_ua) LIKE LOWER($${params.length + 1}) OR LOWER(r.name_en) LIKE LOWER($${params.length + 1}))`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ` + conditions.join(' AND ');
    }

    baseQuery += ` ORDER BY r.id`;

    const exactMatch = await pool.query(baseQuery, params);

    // ✅ Є точні збіги — повертаємо
    if (exactMatch.rows.length > 0) {
      return res.json(exactMatch.rows);
    }

    // 🧠 Немає — виконуємо розумний fallback
    const allRoutes = await pool.query(`
      SELECT r.*, 
        ARRAY(
          SELECT tag_id FROM route_tags WHERE route_id = r.id
        ) as tag_ids
      FROM routes r
    `);

    const computeSimilarity = (route) => {
      let tagScore = 0;
      let durationScore = 0;

      // --- Теги
      if (tagIds.length > 0 && route.tag_ids) {
        const matchedTags = route.tag_ids.filter(id => tagIds.includes(id));
        tagScore = matchedTags.length / tagIds.length;
      }

      // --- Тривалість
      if (userDuration && route.duration_hours) {
        const diff = Math.abs(userDuration - route.duration_hours);
        durationScore = 1 - diff / userDuration;
        if (durationScore < 0) durationScore = 0;
      }

      // --- Підсумковий коефіцієнт
      return (0.6 * tagScore) + (0.4 * durationScore);
    };

    const fallbackCandidates = allRoutes.rows
      .map(route => ({
        ...route,
        similarity: computeSimilarity(route)
      }))
      .filter(route => route.similarity >= 0.4) // 🔸 фільтр найгірших
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(route => ({
        ...route,
        isFallback: true
      }));

    return res.json(fallbackCandidates); // 🔁 Повертаємо fallback масив або []
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
    duration_hours,
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
      duration_hours: req.body.duration_hours ?? existing.duration_hours,
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
          duration_hours = $5,
          image_url = $6,
          content_ua = $7,
          content_en = $8
      WHERE id = $9
      RETURNING *`,
      [
        updatedRoute.name_ua,
        updatedRoute.name_en,
        updatedRoute.description_ua,
        updatedRoute.description_en,
        updatedRoute.duration_hours,
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
