Structure for the app

----- shared/   // acts as reusable components or partials of our site

----- components/   // each component is treated as a mini Angular app
---------- home/
--------------- homeController.js
--------------- homeView.html
---------- login/
--------------- loginController.js
--------------- loginView.html
---------- dashboard/
--------------- dashboardController.js
--------------- dashboardView.html
----- app.module.js   // will handle the setup of your app, load in AngularJS dependencies and so on
----- app.routes.js   // will handle all the routes and the route configuration
assets/
----- img/      // Images and icons for your app
----- css/      // All styles and style related files (SCSS or LESS files)
----- js/       // JavaScript files written for your app that are not for angular
----- libs/     // Third-party libraries such as jQuery, Moment, Underscore, etc.
index.html