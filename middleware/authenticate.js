const jwt = require('jsonwebtoken');

const authenticate = (req,res,next)=>{
    const token = req.header('Authorization');

    if(!token){
        return res.render(`../views/error.ejs`,{msg:'Error Authenticating Yours Profile :('});
    }

    jwt.verify(token,"your_secret_key",(err,decoded)=>{
        if(err){
            return res.render(`../views/error.ejs`,{msg:'Error Authenticating Your Profile :('});
        }
        req.user = decoded;
        next();
    })
}
module.exports = authenticate;

