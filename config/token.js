const jwt = require('jsonwebtoken');
exports.createToken = (id) =>{
    return jwt.sign({
        user : id
    },process.env.TOKEN, {expiresIn: process.env.TOKEN_LIFE}
    );
}




