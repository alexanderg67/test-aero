const pool= require('./pool')
 
 
const createUser = async ( user ) => {
    await pool.query('insert into  users set ? ',user)
    return 1;
}
const getUser = async ( email ) => {
    const [result]= await pool.query( 'select   * from  users where email=? limit 1',email )
    return  result
}

const updateRT = async ( userId, refreshTokenData ) => {
    await pool.query('delete from  refreshSessions where userId= ? ', userId)
    await pool.query('insert into  refreshSessions set ? ',refreshTokenData)
    return 1;
}
const getUserRT = async ( userId) => {
    const [result]= await pool.query( 'select   * from  refreshSessions where userId=? limit 1',userId )
    return  result

}
const deleteUserRT = async ( userId) => {
    await pool.query('delete from  refreshSessions where userId= ? ', userId)
    return  1
}
const getRtByToken = async ( refreshToken) => {
    const [result]= await pool.query( 'select   * from  refreshSessions where refreshToken=? limit 1',refreshToken )
    return  result
}


module.exports= { createUser, getUser , updateRT , getUserRT ,  deleteUserRT , getRtByToken }