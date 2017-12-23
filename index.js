const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport');
const cookieSession = require("cookie-session");

const path = require("path");
const keys = require('./config/keys');

const app = express();

//HEROKU Mongoose
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    //database local port
    mongoose.connect("mongodb://localhost:27017/project3", {
        useMongoClient: true
    });

}

require('./models/User');
//helper module 
require('./services/passport');




//use = middleware for all routes
app.use(
    cookieSession({
        //7 days in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
//to use cookies for authentication
app.use(passport.initialize());
app.use(passport.session());



require('./routes/authRoutes')(app);


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});




var PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});