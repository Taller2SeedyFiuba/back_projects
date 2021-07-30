![example workflow](https://github.com/Taller2SeedyFiuba/back_projects/actions/workflows/main.yml/badge.svg)

# SeedyFiuba Projects Microservice

This is a microservice that provides project CRUD functionalities to SeedyFiuba backend.

### Built With

* [ExpressJS](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [Docker](https://www.docker.com/)

### Deployed In

* [Heroku](https://www.heroku.com/) as a Container Registry.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Docker-cli must be installed. 

### Installation

1. Clone the repo
   ```git
   git clone https://github.com/Taller2SeedyFiuba/back_projects
   ```
2. [Install Docker](https://docs.docker.com/engine/install/), following it's official installation guide for your os

3. Set up environment variables in an ```.env``` named file based on ```.env.example```.

## Usage
Create external network if not exists:

```docker
docker network create my-net
```

Run service with associated DB:

```docker
docker-compose up --b
```

It's important to acknowledge that microservice start may fail if database is not ready. Solution to this situation resides in running the service again.


### Docs

Swagger is used to document the API structure. 
```
{HOST}/api/api-docs
```

## Testing

#### Unit Tests
```npm
docker-compose build && docker-compose run --rm project-service npm run test
```

## Production Deployment CI

This repository is configured using GitHub Actions. When ```main``` is updated an automated deploy is done using CI.

### GitHub Actions secrets

* HEROKU_API_KEY
* HEROKU_APP_NAME

## License
[MIT](https://choosealicense.com/licenses/mit/)
