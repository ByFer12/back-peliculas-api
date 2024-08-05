const expres=require('express');
const router=expres.Router();
const adminController=require('../controllers/adminController');

router.post('/addMovie',adminController.addMovie);
router.get('/listMovies',adminController.listMovies);
router.put('/upadteMovie/:id',adminController.updateMovie);
router.delete('/deleteMovie/:id',adminController.deleteMovie);
router.delete('/deleteUser/:id',adminController.deleteUser);

module.exports=router;