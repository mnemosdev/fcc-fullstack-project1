'use strict';

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users.js');
var configAuth = require('./auth');

/*-
*@ Google passport strategy
*/
module.exports = function(passport){
    
    
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });
    
   passport.use(new GoogleStrategy({
     
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
      
    },
    function(accessToken, refreshToken, profile, done) {
      
      process.nextTick(function () {
        
        // Find the user if exists
        User.findOne({ "google.id" : profile.id }, function(err, user){
          if (err){
            // error
            return done(err);
          }
          
          if (user){
            // user found
            return done(null, user);
          }
          
          else {
            // if the user doesn't exist, create a new one
            var newUser = new User();
            
            // set all the infomations about the user
            newUser.google.id = profile.id;
            newUser.google.token = accessToken;
            newUser.google.displayName = profile.displayName;
            
            // save the user
            newUser.save(function(err){
              if (err){
                throw err;
              }
              
              currentUser.displayName = user.displayName;
              currentUser.id = user.id;
              return done(null, newUser);
            })
          }
        })
      });
    }
  ));
}