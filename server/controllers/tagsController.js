const db = require('../db');

exports.getAllTags = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM tags ORDER BY weight DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getTagById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM tags WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { name, weight } = req.body;
    const result = await db.query(
      'INSERT INTO tags (name, weight) VALUES ($1, $2) RETURNING *',
      [name, weight]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateTag = async (req, res, next) => {
  const { id } = req.params;

  // 🧹 Очистити порожні рядки
  for (let key in req.body) {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  }

  const { name_ua, name_en, weight } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 🔎 Перевірка існування
    const existingResult = await client.query('SELECT * FROM tags WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Тег не знайдено' });
    }

    const existing = existingResult.rows[0];

    const updated = {
      name_ua: req.body.name_ua ?? existing.name_ua,
      name_en: req.body.name_en ?? existing.name_en,
      weight: req.body.weight ?? existing.weight,
    };

    const result = await client.query(
      `UPDATE tags
       SET name_ua = $1,
           name_en = $2,
           weight = $3
       WHERE id = $4
       RETURNING *`,
      [
        updated.name_ua,
        updated.name_en,
        updated.weight,
        id
      ]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Тег оновлено успішно',
      data: result.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};


exports.deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
