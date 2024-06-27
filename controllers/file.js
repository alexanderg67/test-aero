 const db=require('../database/files')
 const path = require('path');
 const fs = require('fs').promises;
 

const uploadFile=async (req,res) => { 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No file uploaded');
      }
      try {
   const sampleFile = req.files.file;
   console.log(sampleFile)
    
   const uploadPath= path.join(__dirname , '../uploads/' , sampleFile.name)
   
    sampleFile.mv(uploadPath, async function(err) {
        if (err)
          return res.status(500).send(err);
        const file ={}
        file.name=sampleFile.name.split('.')[0]
        file.extension=sampleFile.name.split('.')[1]
        file.mimeType=sampleFile.mimetype
        file.size=sampleFile.size
        await db.addUploadedFile(file)
        res.status(201).json({message: 'file uploaded'})
        
      });
    }catch(err){
        return res.status(400).json( {message:'Request Error' }) 
       }
 
}

const listFiles =async (req,res) => {
    try {
    const page= Number(req.query.page) || 1;
    const list_size =Number(req.query.list_size) || 10;

    
    console.log('list',list_size, page)
    const offset=(page-1)* list_size;
    const files= await db.getFileList ( list_size, offset )
    res.status(200).json({ files})
    }catch(err){
    return res.status(400).json( {message:'Request Error' }) 
   }
}

const  deleteFile =async (req,res) => {
const id=req.params.id
if(!id){
    return res.status(400).send('No   file id');
}
try {
const result = await db.getFile(id)
if( result.length==0){
    return res.status(400).send('No such file id');
}
const file= result[0]
const fullFileName=file.name+ '.'+ file.extension
const filePath= path.join(__dirname , '../uploads/' , fullFileName)
await fs.unlink(filePath);
await db.deleteFile(id)
res.status(200).json({message: 'file deleted'})

}catch(err){
    return res.status(400).json( {message:'Request Error' }) 
   }

}

const   getFileInfo =async (req,res) => {
const id=req.params.id
if(!id){
    return res.status(400).send('No   file id');
}

try {
    const result = await db.getFile(id)
    if( result.length==0){
        return res.status(400).send('No such file id');
    }
    const file= result[0]

    res.status(200).json({ file})

}catch(err){
    return res.status(400).json( {message:'Request Error' }) 
   }
    
}

const downloadFile =async (req,res) => {
    const id=req.params.id
    if(!id){
        return res.status(400).send('No   file id');
    }

    try {
        const result = await db.getFile(id)
        if( result.length==0){
            return res.status(400).send('No such file id');
        }
        const file= result[0]
        const fullFileName=file.name+ '.'+ file.extension
        const filePath= path.join(__dirname , '../uploads/' , fullFileName)
        res.download(filePath);
    
    }catch(err){
        return res.status(400).json( {message:'Request Error' }) 
       }
}

const updateFile =async (req,res) => {
    const id=req.params.id
    const {filename} =req.body
    if(!id || !filename){
        return res.status(400).send('wrong data');
    }
    try {
        const result = await db.getFile(id)
        if( result.length==0){
            return res.status(400).send('No such file id');
        }
        const file= result[0]
        const fullFileName=file.name+ '.'+ file.extension
        const oldFile= path.join(__dirname , '../uploads/' , fullFileName)
        const newFile= path.join(__dirname , '../uploads/' , filename)
        const file2 ={}
        file2.name=filename.split('.')[0]
        file2.extension=filename.split('.')[1]
        await fs.rename (oldFile, newFile)
        await db.updateFilename(file2, id)

        res.status(200).json({message: 'file updated'})


    }catch(err){
        return res.status(400).json( {message:'Request Error' }) 
       }


}

module.exports= { uploadFile , listFiles, deleteFile, getFileInfo, downloadFile , updateFile}