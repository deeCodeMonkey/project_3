const passport = require('passport');
const path = require("path");

module.exports = (app) => {

    app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });

    //direct user to linkedin
    app.get("/auth/linkedin",
        passport.authenticate('linkedin')
    );

    //linkedin should return token with data
    app.get('/auth/callback', passport.authenticate('linkedin',
        {
            //successRedirect: '/api/current_user',
            failureRedirect: '/'
        }
    ),
        (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.redirect('/main');
            //res.send(req.user);
        });

    app.get("/api/current_user", (req, res) => {
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        //logout function from passport, kills cookie
        req.logout();
        res.redirect('/')
    });




};