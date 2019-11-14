# ESRMS-GroupG

Before all please create a .env file on the root directory and copy all the settings from .env.example

## Start server

* npm install
* npm run db:migration:run
* npm run db:seed:run
* npm run watch

### Database management
#### Migrations

* To create a new migration file -> **npm run db:migration:make -- NameOfTheMigration**
* To run migrations -> **npm run db:migration:run**
* To rollback migrations -> **npm run db:migration:rollback**

#### Seeds (Mock data)

* To create a new seed file -> **npm run db:seed:make -- NameOfTheSeed**
* To run the seeds -> **npm run db:seed:run**

## Start frontend

* cd frontend
* npm install
* npm start
