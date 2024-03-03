const express = require('express');
const router = express.Router();
const indexControllers = require("../controllers/indexControllers")
const uploadImage = require(`../middlewares/multer`)

//entrada localhost:3000
router.get('/', indexControllers.viewHome );

//abre el formulario de registro de un nuevo restaurante
//localhost:3000/index/register
router.get(`/register`, indexControllers.restaurantRegister)

//recoge los datos del formulario
//localhost:3000/index/register
//la ruta puede tener el mismo nombre porque son métodos distintos
router.post(`/register`, uploadImage("restaurant"), indexControllers.createRestaurant)

//abre la pagina de oneRestaurant
//localhost:3000/index/oneRestaurant/1
router.get("/oneRestaurant/:id", indexControllers.viewOneRestaurant );

//abre el formulario de edición del restaurante
router.get("/editRestaurant/:id", indexControllers.showEditRestaurant);
//recoge los datos del formulario para guardar en bd
router.post("/editRestaurant/:id", uploadImage("restaurant"),indexControllers.editRestaurant);




module.exports = router;
