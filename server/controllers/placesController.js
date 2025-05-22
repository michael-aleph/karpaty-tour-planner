const db = require('../db');

exports.getAllPlaces = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM places ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getPlaceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM places WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createPlace = async (req, res, next) => {
  try {
    const { name_ua, name_en, description_ua, description_en, image_url } = req.body;
    const result = await db.query(
      `INSERT INTO places (name_ua, name_en, description_ua, description_en, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name_ua, name_en, description_ua || null, description_en || null, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updatePlace = async (req, res, next) => {
  const { id } = req.params;

  // 🧹 Очистити "" з тіла
  for (let key in req.body) {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  }

  const { name_ua, name_en, description_ua, description_en, image_url } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 🗂 Отримати поточне значення
    const existingResult = await client.query('SELECT * FROM places WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Місце не знайдено' });
    }

    const existing = existingResult.rows[0];

    const updated = {
      name_ua: req.body.name_ua ?? existing.name_ua,
      name_en: req.body.name_en ?? existing.name_en,
      description_ua: req.body.description_ua ?? existing.description_ua,
      description_en: req.body.description_en ?? existing.description_en,
      image_url: req.body.image_url ?? existing.image_url,
    };

    const result = await client.query(
      `UPDATE places
       SET name_ua = $1,
           name_en = $2,
           description_ua = $3,
           description_en = $4,
           image_url = $5
       WHERE id = $6
       RETURNING *`,
      [
        updated.name_ua,
        updated.name_en,
        updated.description_ua,
        updated.description_en,
        updated.image_url,
        id
      ]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Місце оновлено успішно',
      data: result.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};


exports.deletePlace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM places WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
