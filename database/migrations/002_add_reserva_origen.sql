ALTER TABLE reservas
ADD COLUMN origen VARCHAR(40) NOT NULL DEFAULT 'postman' AFTER observaciones;
