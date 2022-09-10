const jwt = require('jsonwebtoken');

const validateToken = (req, res, next)  => {
    
        req.user = {};
        const authorization = req.headers.authorization || '';
        authorization.replace('"');
        try {
            if(authorization.includes('Bearer')){
                const token = authorization.slice(7);
                jwt.verify(token, process.env.DATA_TOKEN, (err, decoded) => {
                    if(err){
                        throw 'Error token';
                    }else{
                        req.user = decoded.getWallet.user;
                        req.user.wallet = decoded.getWallet.wallet;
                    }
                    next();
                });
            }else{
                throw 'No authorization Bearer';
            }
        } catch (error) {
            console.log(error);
            next();
        }
        
} 

module.exports = validateToken;