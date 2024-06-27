const express =require('express')
const router =express.Router() 

const userController=require('../controllers/user')
    
 
 
router.route('/signup').post(userController.signupUser)
router.route('/signin').post(userController.signinUser)
router.route('/signin/new_token').post(userController.updateBearerToken) 
 
 
module.exports=router