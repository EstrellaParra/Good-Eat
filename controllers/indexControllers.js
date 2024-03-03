const bcrypt = require(`bcrypt`)
const connection = require(`../config/db`)

class IndexControllers{
  //muestra todos los restaurantes 
  viewHome = (req, res) => {
    let sql = "SELECT * FROM restaurant where is_deleted = 0"
    connection.query(sql, (err, result) =>{
      if(err) throw err;
      res.render('index', {result});
    })
  }
  //abre la vista de formulario nuevo restaurante
  restaurantRegister = (req, res) => {
    res.render(`registerForm`)
  }
  //recoge los datos del formulario y crea un nuevo restaurante
  createRestaurant = (req, res) => {
    console.log(req.body);
    const {restaurant_name, style, restaurant_description, phone_number, email, restaurant_img, password, password2} = req.body;
    if(
      restaurant_name === "" ||
      style === "" ||
      restaurant_description === "" ||
      phone_number === "" ||
      email === "" ||
      password === "" ||
      password2 === "" 
      ){
        return res.render("registerForm", {message: "Por favor, rellene todos los campos"})
        }
    if(password !== password2){
      return res.render("registerForm", {message: "La contraseña no coincide"})
    }

    bcrypt.hash(password, 10, function(err, hash){
      if(err) throw err;

      let sql = `INSERT INTO restaurant (restaurant_name, style, restaurant_description,  phone_number, email, password, restaurant_img) VALUES ("${restaurant_name}", "${style}", "${restaurant_description}", "${phone_number}", "${email}", "${hash}", "user.png")`

      if(req.file != undefined){
        let restaurant_img = req.file.filename;
        sql = `INSERT INTO restaurant (restaurant_name, style, restaurant_description, phone_number, email, password, restaurant_img) VALUES ("${restaurant_name}", "${style}", "${restaurant_description}", "${phone_number}", "${email}", "${hash}", "${restaurant_img}")`
      }
      connection.query(sql, (err, result) =>{
        if(err){
          if(err.errno == 1062){
            return res.render("registerForm", {message: "El email ya está registrado"})
            }else{
            throw err;
          }
        }
        res.redirect("/");
      })
    })
  }

  viewOneRestaurant = (req, res) => {
    let id = req.params.id
    let sql = `SELECT * FROM restaurant WHERE restaurant_id = ${id} and is_deleted = 0`
    let sql_dishes = `SELECT * FROM dish WHERE restaurant_id = ${id} and is_deleted = 0`

    connection.query(sql, (err, result) =>{
      if(err) throw err;
      connection.query(sql_dishes, (err_dish, result_dish) =>{
        if(err_dish) throw err_dish;
        res.render("oneRestaurant", {result, result_dish})
      })
      
    }) 
  }
  showEditRestaurant = (req, res) => {
    let id = req.params.id;
    let sql = `SELECT * FROM restaurant WHERE restaurant_id = ${id} and is_deleted = 0`

    connection.query(sql, (err, result) =>{
      if(err) throw err;
      res.render("editFormRest", {result})
    })
  }
  editRestaurant = (req, res) => {
    let id = req.params.id;
    const {restaurant_name, style, phone_number, restaurant_description} = req.body;
    let sql = `UPDATE restaurant SET restaurant_name = "${restaurant_name}", style = "${style}", phone_number = "${phone_number}", restaurant_description = "${restaurant_description}" WHERE restaurant_id = ${id}`

    if(req.file != undefined){
      let img = req.file.filename;
      sql = `UPDATE restaurant SET restaurant_name = "${restaurant_name}", style = "${style}", phone_number = "${phone_number}", restaurant_description = "${restaurant_description}", restaurant_img = "${img}" WHERE restaurant_id = ${id}`
    }
    connection.query(sql, (err, result) =>{
      if(err) throw err
      res.redirect(`/`)
    })
  }
  
}

module.exports = new IndexControllers;