const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const mongoose = ('mongoose');
const keys = require('../config/keys');

//Bring over mongoose constructors
var db = require('../models');

//contain id 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//pull user id 
passport.deserializeUser((id, done) => {
    db.User.findById(id)
        .then((user) => {
            done(null, user);
        });
});


passport.use(new LinkedInStrategy({
    clientID: keys.LINKEDIN_API_KEY,
    clientSecret: keys.LINKEDIN_SECRET_KEY,
    callbackURL: '/auth/callback',
    scope: ['r_basicprofile', 'r_emailaddress'],
},
    function (accessToken, refreshToken, profile, done) {
        //User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
        //    return done(err, user);
        //});
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);


        process.nextTick(function () {
            db.User.findOne({ linkedInId: profile.id })
                .then((existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        //instance of user
                        new db.User({ linkedInId: profile.id }).save()
                            .then((user) => {
                                done(null, user)
                            });
                    }
                });
        });
    }
));
