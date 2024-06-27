const jwt = require('jsonwebtoken')
const db=require('../database/index')
async function auth  (req, res, next) {
    console.log('auth midlewere')
   const headerAuth= req.headers.authorization;
   if (!headerAuth  ||  !headerAuth.startsWith('Bearer ') ){
    return res.status(403).json({ message: "Not authorized" }) 
   }

   const token=headerAuth.split(' ')[1]
    
   try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded.user)
    const result= await db.getUserRT(decoded.user)
    if( result.length> 0){
    req.user=  decoded.user
    next() 
    }else{
      // if logged out no refresh token in db
     throw new Error('there is no refresh token in db')
     
    }

   
   }catch(err) {
    return res.status(403).json({ message: "Not authorized" }) 
   }
 
 
}
module.exports=auth