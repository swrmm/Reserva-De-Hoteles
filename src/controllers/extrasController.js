const db = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const { Extra } = db;

const list = asyncHandler(async (req, res) => {
  const extras = await Extra.findAll({ order: [['nombre', 'ASC']] });
  res.json({ success: true, data: extras });
});

const create = asyncHandler(async (req, res) => {
  const extra = await Extra.create(req.body);
  res.status(201).json({ success: true, data: extra });
});

module.exports = {
  list,
  create,
};
