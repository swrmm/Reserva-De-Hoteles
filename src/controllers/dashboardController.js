const dashboardModel = require("../models/dashboardModel");

async function resumen(req, res) {
  const data = await dashboardModel.getResumen();

  return res.status(200).json({
    success: true,
    data
  });
}

module.exports = {
  resumen
};
