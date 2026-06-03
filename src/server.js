require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { sequelize } = require('./models');

app.listen(config.port, async () => {
  console.log(`Servidor ejecutandose en http://localhost:${config.port}`);
  try {
    await sequelize.authenticate();
    console.log('Conexion a Sequelize establecida correctamente');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
  }
});
