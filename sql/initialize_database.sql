SET SEARCH_PATH TO 'public';

-- CREATE EXTENSION postgis;

CREATE TYPE PROJECT_TYPE AS ENUM ('software', 'electronics', 'art');
CREATE TYPE PROJECT_STAGE AS ENUM ('funding', 'finished', 'cancelled');

DROP TABLE IF EXISTS projects;

CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	ownerid VARCHAR(255) NOT NULL CHECK (ownerid <> ''),
	title VARCHAR(80) NOT NULL CHECK (title <> ''),
	description TEXT NOT NULL CHECK (description <> ''),
	type PROJECT_TYPE NOT NULL,
	stage PROJECT_STAGE NOT NULL DEFAULT 'funding',
	creationdate date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	finishdate TIMESTAMP NOT NULL,
	sponsorshipagreement TEXT NOT NULL CHECK (sponsorshipagreement <> ''),
	seeragreement TEXT NOT NULL CHECK (seeragreement <> ''),
	location GEOMETRY
	
);

DROP TABLE IF EXISTS projectTag;

CREATE TABLE projectTag(
	projectid INTEGER NOT NULL,
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






