# management system

This is a management system for a restaurant and in the future possibly also for hotels. 

The backend is written in Golang while the frontend is built with Angular. 

To run the project, first run ```npm install``` in the client directory. Next run ```npm start``` to start up the frontend localhost and run ```go run .``` in the api directory to run the backend server. To have a working backend there needs to be an existing mysql database running on the localhost with the structure of the database.sql file. In addition a connection.go file needs to be created which manages the connection to the database. If everything is set up, the management system ist displayed on ```http://localhost:4200```.
