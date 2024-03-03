const connection = require(`../config/db`)

class DishesControllers{
  //abre la vista de los platos de cada restaurante
  showDishes = (req, res) => {
    let sql = `SELECT * FROM dish WHERE is_deleted = 0`
    connection.query(sql, (err, result)=>{
      if(err) throw err;
      console.log(result);
      res.render('oneRestaurant', {result});
    })
    
  }
  //abre el form de añadir plato con el id del restaurante
  viewCreateDish = (req, res) =>{
    let id = req.params.id;
    res.render("formDish", {restaurant_id:id})
  }
  createDish = (req, res) =>{
    let id = req.params.id;
    const {dish_name, dish_description} = req.body;
    console.log("body", req.body)
    
    let sql = `INSERT INTO dish (dish_name, dish_description, restaurant_id) VALUES ("${dish_name}", "${dish_description}", "${id}")`

    if (req.file != undefined){
      let img = req.file.filename;
      sql = `INSERT INTO dish (dish_name, dish_description, restaurant_id, dish_img) VALUES ("${dish_name}", "${dish_description}", "${id}", "${img}")`
    }
    connection.query(sql, (err, result)=>{
      if(err) throw err;
      res.redirect(`/oneRestaurant/${id}`)
    })
  }
  totalDelete = (req, res) => {
    let { id, restaurant_id } = req.params;
    let sql = `DELETE FROM dish WHERE dish_id = ${id}`

    connection.query(sql, (err, result) =>{
        if(err) throw err;
        res.redirect(`/oneRestaurant/${restaurant_id}`)

    })
  }

  viewOneRestaurant = (req, res) => {
    let id = req.params.id
    let sql = `SELECT * FROM dish WHERE restaurant_id = ${id} and is_deleted = 0`
    let sql_restaurant = `SELECT * FROM restaurant WHERE restaurant_id = ${id} and is_deleted = 0`
     
    connection.query(sql, (err, result) =>{
      if(err) throw err;
      connection.query(sql_restaurant, (err_restaurant, result_restaurant) =>{
        if(err_restaurant) throw err_restaurant;
        console.log(result)
        res.render("oneRestaurant", {result, result_restaurant})
      })
      
    }) 
  }

  showEditDish = (req, res) => {
    let id = req.params.id;
        let sql = `SELECT * FROM dish WHERE dish_id = ${id} and is_deleted = 0`

        connection.query(sql, (err, result) =>{
            if(err) throw err;
            res.render("editDish", {result})
        })
  }

  editDish = (req, res) => {
    let {id, restaurant_id} = req.params;
    const { dish_name, dish_description } = req.body;
    let sql = `UPDATE dish SET dish_name ="${dish_name}", dish_description = "${dish_description}" WHERE dish_id = ${id}`
    
    if(req.file != undefined){
        let img = req.file.filename;
        sql = `UPDATE dish SET dish_name ="${dish_name}", dish_description = "${dish_description}", dish_img = "${img}" WHERE dish_id = ${id} `
    }

    connection.query(sql, (err, result)=>{
        if(err) throw err
        res.redirect(`/oneRestaurant/${restaurant_id}`)
    })
}
}

module.exports = new DishesControllers;