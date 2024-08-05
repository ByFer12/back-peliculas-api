const express=require('express');
const bodyParser=require('body-parser');
const fs= require('fs');
const bcrypt=require('bcrypt');

const app=express();
const PORT=process.env.PORT||4000;

app.use(bodyParser.json());

// Rutas
const authRoutes = require('./routes/autenticacion');
const userRoutes = require('./routes/users');
const adminRout = require('./routes/admin');

app.use('/auth',authRoutes);



app.use('/user', userRoutes);
app.use('/admin', adminRout);
  

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})