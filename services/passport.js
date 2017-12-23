const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const mongoose = ('mongoose');
const keys = require('../config/keys');

//Bring over mongoose constructors
var db = require('../models');

//contain id to be placed in cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//pull user id from cookie
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
    proxy: true
},
    function (accessToken, refreshToken, profile, done) { 
        //console.log('accessToken', accessToken);
        //console.log('refreshToken', refreshToken);
        console.log('profile===================', JSON.stringify(profile, null, 2));

        process.nextTick(function () {
            db.User.findOne({ linkedInId: profile.id })
                .then((existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        //instance of user
                        new db.User({
                            linkedInId: profile.id,
                            fullName: profile.displayName,
                            email: profile._json.emailAddress,
                            photo: profile._json.pictureUrl,
                            headline: profile._json.headline,
                            location: profile._json.location.name
                        }).save()
                            .then((user) => {
                                done(null, user)
                            });
                    }
                });
        });
    }
));
