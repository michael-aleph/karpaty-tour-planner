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
  try {
    const { id } = req.params;
    const { name, weight } = req.body;
    const result = await db.query(
      'UPDATE tags SET name = $1, weight = $2 WHERE id = $3 RETURNING *',
      [name, weight, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
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
