SET SEARCH_PATH TO 'public';

-- CREATE EXTENSION postgis;

CREATE TYPE PROJECT_TYPE AS ENUM ('Software', 'Electronics', 'Art');
CREATE TYPE PROJECT_STAGE AS ENUM ('Funding', 'Finished', 'Cancelled');

DROP TABLE IF EXISTS projects;

CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	ownerid VARCHAR(255) NOT NULL CHECK (ownerid <> ''),
	title VARCHAR(80) NOT NULL CHECK (title <> ''),
	description TEXT NOT NULL CHECK (description <> ''),
	type PROJECT_TYPE NOT NULL,
	stage PROJECT_STAGE NOT NULL DEFAULT 'Funding',
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


-- ALTER TABLE users ADD CONSTRAINT pk_users PRIMARY KEY(id);

-- PRUEBA DE INSERCION
-- INSERT INTO projects(
-- 	ownerid, title, description, type, finishdate, sponsorhipagreement, seeragreement)
--	VALUES ('userid1', 'titulo1', 'descp1', 'Software', '2021-08-25', 'sponsor agreement', 'seer agreement');

-- SELECT * FROM projects






