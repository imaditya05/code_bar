const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authenicate using passport

passport.use(new LocalStrategy({
    usernameField: 'email'
},
function(email, password, done){
    //find a user and establish the identity
    User.findOne({email: email}, function(err, user){
        if(err){
            console.log('error in finding user --> Passport');
            return done(err);
        }
        if(!user || user.password != password){
            console.log('Invalid Username/Password');
            return done(null, false);
        }

        return done(null, user);
    });

}
));

//serializing the user to decide which key to be kept in the cookie

passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserializin the user form the key in the cookies

passport.deserializeUser(function(id , done){
    User.findById(id, function(err, user){
        if(err){console.log('Error in findin user --> Passport'); return done(err);}
        return done(null, user);
    })
});

//check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    //if the user is sign in, pass the user to the next function User Controller
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not sign in 
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookies and we are 
        // just sendin it to the locals for the views
        res.locals.user = req.user
    }
    next();
}

module.exports = passport;
