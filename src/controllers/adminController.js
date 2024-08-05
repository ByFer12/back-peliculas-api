const fs = require('fs');
const path = require('path');
const moviesFilePath = path.join(__dirname, '../data/movie.json');
const usersFilePath = path.join(__dirname, '../data/users.json');
const { v4: uuidv4 } = require('uuid');

const readMoviesFile = () => {
    return JSON.parse(fs.readFileSync(moviesFilePath));
};
const writeMoviesFile=(data)=>{
    fs.writeFileSync(moviesFilePath,JSON.stringify(data,null,2));
}

const  readUsersFile=()=>{
    return JSON.parse(fs.readFileSync(usersFilePath));
}

const writeUsersFile=(data)=>{
    fs.writeFileSync(usersFilePath,JSON.stringify(data,null,2));
}

exports.addMovie=(req,res)=>{
  const{titulo,sinopsis,precioRenta,director,anioEstreno,duracion,genero,imagen}=req.body;
    let movies=readMoviesFile();
    movies.push({id:uuidv4(),titulo,sinopsis,precioRenta,director,anioEstreno,duracion,genero,imagen});
    writeMoviesFile(movies);
    res.status(200).json({message:'Pelicula agregada correctamente'});
}


exports.updateMovie=(req,res)=>{
    const{id}=req.params;
    const updateData=req.body;
    let movies=readMoviesFile();
    const indexMovie=movies.findIndex(movie=>movie.id==id);
    if(indexMovie===-1){
        return res.status(404).json({message:'Pelicula no encontrada'});

    }

    movies[indexMovie]={...movies[indexMovie], ...updateData};
    writeMoviesFile(movies);

    res.status(200).json({message:'Pelicula actualizada correctamente'});

}
exports.deleteMovie = (req, res) => {
    const { id } = req.params;
    let movies = readMoviesFile();

    movies = movies.filter(movie => movie.id !== id);
    writeMoviesFile(movies);

    res.status(200).json({ message: 'Pelicula eliminada correctamente' });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    let users = readUsersFile();

    users = users.filter(user => user.id !== id);
    writeUsersFile(users);

    res.status(200).json({ message: 'User deleted successfully' });
};

exports.listMovies = (req, res) => {
    let movies = readMoviesFile();
    res.status(200).json(movies);
};
