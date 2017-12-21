const express = require('express');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const keys = require('./config/keys');
const path = require("path");
//const session = require("express-session");

const app = express();

var PORT = process.env.PORT || 8080;

//app.use(express.static(path.join(__dirname, 'public')));
//app.set('views', path.join(__dirname, 'views'));


//// Authentication configuration
//app.use(session({
//    resave: false,
//    saveUninitialized: true,
//    secret: 'blablablah'
//}));

//// Passport
//app.use(passport.initialize());
//app.use(passport.session());



passport.use(new LinkedInStrategy({
    clientID: keys.LINKEDIN_API_KEY,
    clientSecret: keys.LINKEDIN_SECRET_KEY,
    callbackURL: `http://localhost:${PORT}/auth/callback`,
    scope: ['r_basicprofile', 'r_emailaddress'],
},
    function (accessToken, refreshToken, profile, done) {
        //User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
        //    return done(err, user);
        //});

        //process.nextTick(function () {

            console.log('accessToken', accessToken);
            console.log('refreshToken', refreshToken);
            console.log('profile', profile);

          //  return done(null, profile);
        //});
    }
));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});

//direct user to linkedin
app.get("/auth/linkedin",
    passport.authenticate('linkedin', { state: true })
    //function (req, res) {
    //res.sendFile(path.join(__dirname, "./index.html"));}
);


//linkedin should return token with data
app.get('/auth/callback', passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/login'
}));



app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
    console.log('processed but not successful from linkedin');
});




app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});