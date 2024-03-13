const express = require('express');
const JWT = require('jsonwebtoken');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API.'
    })
})

app.post('/post', verifyToken, (req, res) => {
    JWT.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created..',
                authData: authData,
                timestamp: Date(),
            })
        }
    })
})

app.post('/login', (req, res) => {
    // mock user
    const user = {
        id: 1,
        username: 'Bryan',
        email: 'bryan@gmail.com'
    }
    
    JWT.sign({ user: user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        })
    })
})

// format token
// Authorization: Bearer <access_token> 

//verify token
function verifyToken(req, res, next) {
    // get auth header
    const bearerHeader = req.headers['authorization'];
    // check if undefined
    if (typeof bearerHeader !== 'undefined') {
        // split at the space (eg. Bearer_<access_token>)
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // proceed
        next();
    } else {
        // forbidden
        res.sendStatus(403)
    }
}

app.listen(3000, () => {
    console.log('App listening on port 3000.')
})

