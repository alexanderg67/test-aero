const bcrypt= require('bcryptjs');
const db=require('../database/index')
const jwt = require('jsonwebtoken')
const { StatusCodes } =require('http-status-codes')

const signupUser =async (req,res) => {
const {id,password } = req.body
try{
let user ={}
const re = /\S+@\S+\.\S+/;
if( !id || !password){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'wrong data'})     
}
if ( !re.test(id) || password.length <5){
return res.status(StatusCodes.BAD_REQUEST).json({message:'wrong data'})    
}
const salt= await bcrypt.genSalt(8)
user.hash= await bcrypt.hash(password,salt)
user.email=id
const result= await db.getUser( id)
 

if( result.length> 0){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'login used'}) 
}
await db.createUser(user)
  
const accessToken = jwt.sign( { user: user.email }, process.env.JWT_SECRET,  {   expiresIn: '10m'});
const refreshToken = jwt.sign( { user: user.email }, process.env.REFRESH_JWT_SECRET,  {   expiresIn: '4d'});
await db.updateRT( user.email, {userId: user.email, refreshToken:  refreshToken } )
res.status(StatusCodes.CREATED).json({ accessToken , refreshToken} )
}catch(err){
    console.log(err)
    return res.status(StatusCodes.BAD_REQUEST).json( {message:'Request Error' }) 
   }
}

const signinUser =async (req,res) => {
    const {id,password } = req.body
    try {
    if( !id || !password){
        return res.status(StatusCodes.FORBIDDEN).json({message:'wrong data'})     
    }
    const result= await db.getUser( id)
    if( result.length==0){
        return res.status(StatusCodes.FORBIDDEN).json({message:'wrong data'}) 
    }
    const user= result[0]
    const compareResult=await bcrypt.compare(password, user.hash);
     
     if(compareResult) { 
    const accessToken = jwt.sign( { user: user.email }, process.env.JWT_SECRET,  {   expiresIn: '10m'});
    const result2= await db.getUserRT( user.email)
    if( result2.length==0){
    // Если Refresh token был удален после logout. Создается новый RT в БД и возвращается пара RT и  access token
    console.log('Refresh token был удален после logout')
    const refreshToken = jwt.sign( { user: user.email }, process.env.REFRESH_JWT_SECRET,  {   expiresIn: '4d'});
    await db.updateRT( user.email, {userId: user.email, refreshToken:  refreshToken } )
    return res.status(StatusCodes.OK).json({  accessToken, refreshToken  })
    }else{
        const rtData= result2[0]
        console.log(rtData)
        jwt.verify(rtData.refreshToken, process.env.REFRESH_JWT_SECRET, async function(err, decoded) {
            if(err) {
                // RT exipied. Создается новый RT в БД и возвращается пара RT и  access token
            console.log('RT is expired ')
            const refreshToken = jwt.sign( { user: user.email }, process.env.REFRESH_JWT_SECRET,  {   expiresIn: '4d'});
            await db.updateRT( user.email, {userId: user.email, refreshToken:  refreshToken } )
            return res.status(StatusCodes.OK).json({  accessToken, refreshToken  })
            }else{ 
                // RT валидный. Возвращается текущий RT и новый access token
                 
                return res.status(StatusCodes.OK).json({  accessToken, refreshToken: rtData.refreshToken  })
            }
          });
    }
    
   

     }else{
    return res.status(StatusCodes.FORBIDDEN).json({message:'wrong data'}) 
     }

    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).json( {message:'Request Error' }) 
       }
}
 
const updateBearerToken =async (req,res) => {
    const { rt} = req.body
    if(!rt ){
        return res.status(StatusCodes.FORBIDDEN).json({message:'Not authorized'})  
    }
    try {
    const decoded= jwt.verify(rt, process.env.REFRESH_JWT_SECRET)
     const result= await db.getRtByToken(rt) 
     if( result.length==0){
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" }) 
     }
        const accessToken = jwt.sign( { user: decoded.user}, process.env.JWT_SECRET,  {   expiresIn: '10m'});
        return res.status(StatusCodes.OK).json({accessToken   } )
    }catch(err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" })   
        }
     
}

 

const getUserId  =async (req,res) => {
    return res.status(StatusCodes.OK).json({  userId: req.user })
}

const logoutUser =async (req,res) => {
    try {
    const userId=req.user
    console.log(userId)
    await db.deleteUserRT(userId)
    return res.status(StatusCodes.OK).json({  message: 'logout success' })
    }catch(err){
    return res.status(StatusCodes.BAD_REQUEST).json( {message:'Request Error' }) 
   }
}

module.exports= {   signupUser, signinUser, updateBearerToken , getUserId , logoutUser} 