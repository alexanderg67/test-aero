const express =require('express')
const router =express.Router() 
 
const userController=require('../controllers/user')
    

router.route('/info').get( userController.getUserId  )
router.route('/logout').get( userController.logoutUser  ) 
 
 
module.exports=router