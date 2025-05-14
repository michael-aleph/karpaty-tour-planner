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
  try {
    const { id } = req.params;
    const { name_ua, name_en, description_ua, description_en, image_url } = req.body;
    const result = await db.query(
      `UPDATE places
       SET name_ua = $1, name_en = $2, description_ua = $3, description_en = $4, image_url = $5
       WHERE id = $6 RETURNING *`,
      [name_ua, name_en, description_ua || null, description_en || null, image_url || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
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
