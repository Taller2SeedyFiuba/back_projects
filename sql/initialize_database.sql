SET SEARCH_PATH TO 'public';

-- CREATE EXTENSION postgis;

CREATE TYPE PROJECT_TYPE AS ENUM (
	'comida',
	'arte',
	'periodismo',
	'manualidades',
	'música',
	'danza',
	'fotografía',
	'diseño',
	'publicaciones',
	'tecnología',
	'software',
	'refugio',
	'transporte',
	'legal'
);

CREATE TYPE PROJECT_STATE AS ENUM (
	'on_review',
	'funding',
	'canceled',
	'in_progress',
	'completed'
);

DROP TABLE IF EXISTS projects;

CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	ownerid VARCHAR(255) NOT NULL CHECK (ownerid <> ''),
	title VARCHAR(80) NOT NULL CHECK (title <> ''),
	description TEXT NOT NULL CHECK (description <> ''),
	type PROJECT_TYPE NOT NULL,
	state PROJECT_STATE NOT NULL DEFAULT 'on_review',
	actualstage INTEGER NOT NULL DEFAULT 0,
	creationdate date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	location GEOMETRY,
	locationdescription VARCHAR(80) NOT NULL CHECK (locationdescription <> ''),
	sponsorscount INTEGER NOT NULL CHECK (sponsorscount >= 0) DEFAULT 0,
	favouritescount INTEGER NOT NULL CHECK (favouritescount >= 0) DEFAULT 0,
	fundedamount INTEGER NOT NULL CHECK (fundedamount >= 0) DEFAULT 0
);

DROP TABLE IF EXISTS projectTag;

CREATE TABLE projectTag(
	projectID INTEGER NOT NULL,
	tag VARCHAR(30) NOT NULL CHECK (tag <> '')
);

ALTER TABLE projectTag ADD CONSTRAINT pk_projecttag PRIMARY KEY(projectid, tag);
ALTER TABLE projectTag ADD CONSTRAINT fk_projecttag FOREIGN KEY(projectid) REFERENCES projects ON DELETE CASCADE;

DROP TABLE IF EXISTS multimedia;

CREATE TABLE multimedia(
	projectid INTEGER NOT NULL,
	position INTEGER NOT NULL,
	url VARCHAR(255) NOT NULL CHECK (url <> '')
);

ALTER TABLE multimedia ADD CONSTRAINT pk_multimedia PRIMARY KEY(projectid, position);
ALTER TABLE multimedia ADD CONSTRAINT fk_multimedia FOREIGN KEY(projectid) REFERENCES projects ON DELETE CASCADE;

DROP TABLE IF EXISTS stages;

CREATE TABLE stages(
	projectid INTEGER NOT NULL,
	position INTEGER NOT NULL,
	title VARCHAR(40) NOT NULL CHECK (title <> ''),
	description VARCHAR(255) NOT NULL CHECK (description <> ''),
	amount INTEGER NOT NULL CHECK (amount >= 0) DEFAULT 0
);

ALTER TABLE stages ADD CONSTRAINT pk_stages PRIMARY KEY(projectid, position);
ALTER TABLE stages ADD CONSTRAINT fk_stages FOREIGN KEY(projectid) REFERENCES projects ON DELETE CASCADE;





