    const fs=require('fs');
    const path=require('path');
    const bciypt=require('bcrypt');
    const userFilePath=path.join(__dirname,'../data/users.json');
    const { v4: uuidv4 } = require('uuid');

    const readUsersFile = () => {
        return JSON.parse(fs.readFileSync(userFilePath));
    };
    
    const writeUsersFile = (data) => {
        fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2));
    };

    exports.register=async(req,res)=>{
        const {nombre,apellido, genero, email,password, cumpleanios, isAdmin=false}=req.body;
        let users=readUsersFile();

        if(users.some(user=>user.email===email)){
            return res.status(400).json({message:'EL usuario ya existe'});
        
        }
        const passHash=await bciypt.hash(password,10);
        users.push({id:uuidv4(),nombre,apellido, genero,email, password:passHash, cumpleanios, isAdmin});
        writeUsersFile(users);
        res.status(201).json({message:'Usuario registrado Correctamente'});
    };

    exports.login=async(req,res)=>{
        const{email,password}=req.body;
        let users=readUsersFile();
        const user= users.find(user=>user.email===email);
        //const user=users.find(user=>user.password===password);
        if(!user){
            return res.status(400).json({message:'Correo invalido'});
        }
        const isPassswordValid=await bciypt.compare(password,user.password);
        if(!isPassswordValid){
            return res.status(400).json({message:'Contraseña invalida'});
        }
        res.status(200).json({message:'Sesion iniciada'});
    }