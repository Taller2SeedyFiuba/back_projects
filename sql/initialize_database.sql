-- Initialization script, projects microservice, SeedyFiuba Backend.

-- Enable PostGIS (as of 3.0 contains just geometry/geography)
CREATE EXTENSION postgis;
-- enable raster support (for 3+)
CREATE EXTENSION postgis_raster;
-- Enable Topology
CREATE EXTENSION postgis_topology;

-- We create a database from the .csv files

DROP TABLE IF EXISTS cities;

CREATE TABLE cities(
	city VARCHAR(50) NOT NULL,
	country VARCHAR(30) NOT NULL,
	lat DECIMAL(10, 4) NOT NULL,
	lng DECIMAL(10, 4) NOT NULL
);

ALTER TABLE cities ADD CONSTRAINT pk_cities PRIMARY KEY (country, city);

--COPY cities(city, lat, lng, country) FROM PROGRAM 'awk FNR-1 csv/*.csv | cat' DELIMITER ',' CSV HEADER;
-- COPY cities(city, lat, lng, country) FROM PROGRAM 'awk FNR-1 csv/*.csv | cat' DELIMITER ',' CSV HEADER;
COPY cities(city, lat, lng, country) FROM './csv/ar.csv' DELIMITER ',' CSV HEADER;


SELECT postgis_full_version();

/*
-- Enable PostGIS Advanced 3D
-- and other geoprocessing algorithms
-- sfcgal not available with all distributions
CREATE EXTENSION postgis_sfcgal;
-- fuzzy matching needed for Tiger
CREATE EXTENSION fuzzystrmatch;
-- rule based standardizer
CREATE EXTENSION address_standardizer;
-- example rule data set
CREATE EXTENSION address_standardizer_data_us;
-- Enable US Tiger Geocoder
CREATE EXTENSION postgis_tiger_geocoder;
*/
DROP TABLE IF EXISTS projects;

CREATE TABLE projects(
	id INTEGER NOT NULL SERIAL,
	owneruid VARCHAR(255) NOT NULL,
	description VARCHAR(MAX),
	location GEOGRAPHY

);


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