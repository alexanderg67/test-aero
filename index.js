const express = require('express');
const app = express();
const cors = require('cors')
const fileUpload = require("express-fileupload");
require('dotenv').config();
const authMiddleware=require('./middleware/authentication')
const userRouter=require('./routers/user')
const userRouterBearerAuth=require('./routers/userBearerAuth')
const fileRouter=require('./routers/file')
app.use(cors())
app.use(fileUpload());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

 app.use('/',userRouter)
 app.use(authMiddleware) // below routers with bearer  authorization
 app.use('/',userRouterBearerAuth)
 app.use('/file',fileRouter)


app.listen(3001, () => console.log('application started  on port 3001'))