const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
    // use email and password already authenticated
    // just need to provide a session token now
    res.send({ token: tokenForUser(req.user ) })
}

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const admin = req.body.admin ? req.body.admin : false;

    if(!email || !password) {
        res.status(422).send({ error: 'you must provide an email + password'})
    }

    User.findOne({ email: email }, (err, existingUser) => {
        if(err) { return next(err); }

        if (existingUser) {
            return res.status(422).send({ error: 'email is in use' });
        }

        const user = new User({
            email: email,
            password: password,
            admin: admin
        });

        user.save(err => {
            
          if(err) { return next(err); }  

          res.json({ 
              token: tokenForUser(user),
              user: user
            });
        });
    });




}