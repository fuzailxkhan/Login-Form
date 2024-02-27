const jwt = require('jsonwebtoken');

const secret_key = "RimshaAnwar4Ever"

const authenticateToken = (req,res,next)=>{
    const token = req.cookies["x-jwt-token"];
    console.log("Middleware executed")
    if (!token) {console.log("Middleware If executed");return res.sendStatus(401)}

    jwt.verify(token ,secret_key, (err , user)=>{
        console.log("Middleware JWT Verify executed")
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    } )
}


module.exports = authenticateToken;