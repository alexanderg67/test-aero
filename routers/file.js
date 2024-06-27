const express =require('express')
const router =express.Router() 
 
const fileController=require('../controllers/file')
    
 
router.route('/upload').post(fileController.uploadFile)
router.route('/list').get(  fileController.listFiles)
router.route('/:id').get(  fileController.getFileInfo)
router.route('/download/:id').get(  fileController.downloadFile)
router.route('/delete/:id').delete(  fileController.deleteFile)
router.route('/update/:id').put(  fileController.updateFile)
 
module.exports=router