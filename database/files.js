const pool= require('./pool')
const addUploadedFile = async ( file) => {
    await pool.query('insert into  files set ? ', file)
    return 1;
}
const getFileList = async ( limit, offset) => {
    const [result]= await pool.query( 'select   * from  files LIMIT ? OFFSET ?', [limit, offset])
    return  result
}
const getFile = async ( id) => {
    const [result]= await pool.query( 'select   * from  files where id=? limit 1', id )
    return  result
}
const deleteFile = async ( id) => {
    await pool.query('delete from  files where id= ? ', id)
    return  1
}

const updateFilename = async ( file, id) => {
  
    await pool.query(' update  files set ?  where  id =?', [file, id])
    return 1;
}


 

module.exports= {    addUploadedFile  , getFileList, getFile , deleteFile, updateFilename}