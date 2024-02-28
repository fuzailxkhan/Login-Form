const jwt = require('jsonwebtoken');
const {jwtDecode} = require("jwt-decode");

const secret_key = "RimshaAnwar4Ever"

const authenticateToken = (req,res,next)=>{
    const token = req.cookies["x-jwt-token"];
    console.log("Middleware executed")
    if (!token) {console.log("Middleware If executed");return res.sendStatus(401)}

    jwt.verify(token ,secret_key, (err , user)=>{
        console.log("Middleware JWT Verified executed")
        if (err) {
            if(err.name =="TokenExpiredError") {
                console.log("Token Expired");
                const tokenData = jwtDecode(token);
                console.log(tokenData);
                const newToken = jwt.sign({uid:tokenData.uid,role:tokenData.role}, secret_key, {expiresIn:'1m'});
                req.newToken = newToken;

            }
            else{return res.status(403).json({Message:"An Error Occured, Please Logout and Login again."})}
        };
        
        next();
    } )
}


module.exports = authenticateToken;