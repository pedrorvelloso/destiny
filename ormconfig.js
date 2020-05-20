const rootDir = process.env.NODE_ENV === "development" ?
  "./src" :
  "./build"

module.exports = {
  "type": "postgres",
  "host": process.env.PG_HOST || "localhost",
  "port": process.env.PG_PORT || 5432,
  "username": process.env.PG_USER || "postgres",
  "password": process.env.PG_PASSWORD || "admin",
  "database": process.env.PG_DATABASE || "destiny",
  "entities": [
    rootDir + "/modules/**/infra/typeorm/entities/*.{js,ts}"
  ],
  "subscribers": [
    rootDir + "/modules/**/infra/typeorm/subscribers/*.{js,ts}"
  ],
  "migrations": [
    rootDir + "/shared/infra/typeorm/migrations/*.{js,ts}"
  ],
  "cli": {
    "migrationsDir": rootDir + "/shared/infra/typeorm/migrations"
  }
}
