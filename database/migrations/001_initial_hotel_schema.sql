CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'recepcionista') NOT NULL DEFAULT 'recepcionista',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reset_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS habitaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20) NOT NULL UNIQUE,
  tipo ENUM('individual', 'doble', 'suite', 'familiar') NOT NULL,
  capacidad INT NOT NULL,
  precio_noche DECIMAL(10,2) NOT NULL,
  estado ENUM('disponible', 'ocupada', 'mantenimiento', 'inactiva') NOT NULL DEFAULT 'disponible',
  descripcion TEXT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_habitacion_capacidad CHECK (capacidad > 0),
  CONSTRAINT chk_habitacion_precio CHECK (precio_noche > 0)
);

CREATE TABLE IF NOT EXISTS extras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_extra_precio CHECK (precio >= 0)
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacion_id INT NOT NULL,
  usuario_id INT NULL,
  nombre_huesped VARCHAR(140) NOT NULL,
  email_huesped VARCHAR(160) NOT NULL,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(10,2) NOT NULL,
  extras_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  observaciones TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reserva_habitacion
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_reserva_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL,
  CONSTRAINT chk_reserva_total CHECK (total >= 0),
  CONSTRAINT chk_reserva_extras_total CHECK (extras_total >= 0),
  CONSTRAINT chk_reserva_fechas CHECK (fecha_salida > fecha_entrada)
);
