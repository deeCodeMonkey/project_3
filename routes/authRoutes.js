const passport = require('passport');
const path = require("path");

module.exports = (app) => {


    //direct user to linkedin
    app.get("/auth/linkedin",
        passport.authenticate('linkedin', { state: true })
    );

    //linkedin should return token with data
    app.get('/auth/callback', passport.authenticate('linkedin', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get("/api/current_user", (req, res) => {
        //res.sendFile(path.join(__dirname, "../index.html"));
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        //logout function from passport, kills cookie
        req.logout();
        res.send(req.user);
    });


    app.get("/login", function (req, res) {
        res.sendFile(path.join(__dirname, "../index2.html"));
        console.log('processed but not successful from linkedin');
    });


};