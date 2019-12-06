mysql -h 127.0.0.1 -u root -Bse "DROP DATABASE ESRMS;CREATE DATABASE ESRMS" &&
npm run db:migration:run &&
npm run db:seed:run
