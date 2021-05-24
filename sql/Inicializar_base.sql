-- Inicializa la base de datos, creando las tablas y las restricciones entre ellas.

DROP TABLE IF EXISTS users;

CREATE TABLE users(
	id VARCHAR(255) NOT NULL CHECK (id <> ''),
	firstname VARCHAR(30) NOT NULL CHECK (firstname <> ''),
	lastname VARCHAR(30) NOT NULL CHECK (lastname <> ''),
	email VARCHAR(30) NOT NULL CHECK (email <> ''),
	birthdate date NOT NULL,
	signindate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD CONSTRAINT pk_users PRIMARY KEY(id);
