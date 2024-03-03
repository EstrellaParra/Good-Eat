const express = require('express');
const router = express.Router();
const multer = require("../middlewares/multer");

const dishesControllers = require("../controllers/dishesControllers")

//entrada localhost:3000/dishes
router.get('/', dishesControllers.showDishes );

//abre el form de creación de platos
router.get(`/createDish/:id`, dishesControllers.viewCreateDish)

router.post(`/createDish/:id`, multer("dishes"), dishesControllers.createDish)

//borrar plato
router.get(`/deleteDish/:id/:restaurant_id`, dishesControllers.totalDelete);

//modificación de plato
//router.get("/editDish/:id/:restaurant_id", dishesControllers.viewOneRestaurant);

router.get("/editDish/:id", dishesControllers.showEditDish);

router.post("/editDish/:id/:restaurant_id", multer("dishes"), dishesControllers.editDish);

module.exports = router;
