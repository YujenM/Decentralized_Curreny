const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
async function(accessToken, refreshToken, profile, cb) {
    const db = require('../../Database/ConnectDb');
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    try {
        const checkemailquery = 'SELECT * FROM Users WHERE email = ?';
        db.getquery(checkemailquery, [email], (err, results) => {
            if (err) {
                return cb(err);
            }
            if (results.length === 0) {
                const AddUserQuery = 'INSERT INTO Users (username, email, google_id) VALUES (?, ?, ?)';
                db.getquery(AddUserQuery, [displayName, email, id], (err, result) => {
                    if (err) {
                        return cb(err);
                    }
                    const token = jwt.sign({ user_id: result.insertId, email }, process.env.SECRET_KEY);
                    return cb(null, { profile, token });
                });
            } else {
                const token = jwt.sign({ user_id: results[0].user_id, email }, process.env.SECRET_KEY);
                return cb(null, { profile, token });
            }
        });
    } catch (err) {
        return cb(err);
    }
}));
