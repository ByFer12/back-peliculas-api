const fs = require('fs');
const path = require('path');
const moviesFilePath = path.join(__dirname, '../data/movie.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

const readMoviesFile = () => {
    return JSON.parse(fs.readFileSync(moviesFilePath));
};

const writeMoviesFile = (data) => {
    fs.writeFileSync(moviesFilePath, JSON.stringify(data, null, 2));
};

const readUsersFile = () => {
    return JSON.parse(fs.readFileSync(usersFilePath));
};

const writeUsersFile = (data) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
};

exports.getMovies = (req, res) => {
    let movies = readMoviesFile();
    res.status(200).json(movies);
};

exports.rentMovie = (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    let movies = readMoviesFile();
    let users = readUsersFile();

    const movie = movies.find(movie => movie.id === id);
    const user = users.find(user => user.id === userId);

    console.log('Pelicula:', movie);
    console.log('Usuario:', user);

    if (!movie || !user) {
        return res.status(404).json({ message: 'Pelicula o usuario no encontrado' });
    }

    if (!user.rentedMovies) {
        user.rentedMovies = [];
    }

    user.rentedMovies.push({ movieId: movie.id, rentedAt: new Date() });
    writeUsersFile(users);

    res.status(200).json({ message: 'Pelicula rentada correctamente' });
};

exports.returnMovie = (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    let users = readUsersFile();

    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asegurarse de que el array rentedMovies y rentalHistory están definidos
    if (!user.rentedMovies) {
        user.rentedMovies = [];
    }

    const movieIndex = user.rentedMovies.findIndex(movie => movie.movieId === id);
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Pelicula no encontrada en renta de peliculas' });
    }

    const rentedMovie = user.rentedMovies[movieIndex];
    const rentedDuration = Math.ceil((new Date() - new Date(rentedMovie.rentedAt)) / (1000 * 60 * 60 * 24));
    const fine = rentedDuration > 2 ? (rentedDuration - 2) * 5 : 0;

    user.rentedMovies.push({ ...rentedMovie, returnedAt: new Date(), fine });
    user.rentedMovies.splice(movieIndex, 1);
    writeUsersFile(users);

    if (fine > 0) {
        res.status(200).json({ message: `Pelicula devuelta correctamente. Se le ha cobrado una mora de Q${fine} por devolver la pelicula después de 48 horas`, fine });
    } else {
        res.status(200).json({ message: 'Pelicula devuelta correctamente', fine });
    }
};

exports.addComment = (req, res) => {
    const { id } = req.params;
    const { userId, comment, rating } = req.body;
    let movies = readMoviesFile();
    let users = readUsersFile();

    const movie = movies.find(movie => movie.id === id);
    const user = users.find(user => user.id === userId);

    if (!movie || !user) {
        return res.status(404).json({ message: 'Pelicula o usuario no encontrado' });
    }

    if (!movie.comments) {
        movie.comments = [];
    }

    movie.comments.push({ userId, comment, rating, createdAt: new Date() });
    writeMoviesFile(movies);

    res.status(200).json({ message: 'Comentario agregado correctamente' });
};

exports.deleteComment = (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    let movies = readMoviesFile();

    const movie = movies.find(movie => movie.id === id);
    if (!movie) {
        return res.status(404).json({ message: 'Pelicula no encontada' });
    }

    movie.comments = movie.comments.filter(comment => comment.userId !== userId);
    writeMoviesFile(movies);

    res.status(200).json({ message: 'Comentario eliminado correctamente' });
};

exports.getRentalHistory = (req, res) => {
    const { userId } = req.body;
    let users = readUsersFile();

    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user.rentalHistory);
};

exports.editProfile = (req, res) => {
    const { userId, name, surname, gender, birthdate } = req.body;
    let users = readUsersFile();

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    users[userIndex] = { ...users[userIndex], name, surname, gender, birthdate };
    writeUsersFile(users);

    res.status(200).json({ message: 'Perfil actualizado correctamente' });
};
