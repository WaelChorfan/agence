var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agence1'
  //   ,port:3306
});


router.get('/', function (req, res) {
  connection.query('SELECT * from  voiture', function (error, results, fields) {
    res.render('voitures', { list: results, listLength: results.length });
  });

});

router.post('/search', function (req, res) {
  var s = req.body.search
  var query = "SELECT * from  voiture where marque like '%" + s + "%' or modele like '%" + s + "%'   or matricule like '%" + s + "%'"

  console.log(query);
  connection.query(query, function (error, results, fields) {
    res.render('voitures', { list: results, listLength: results.length });
  });

});

router.get('/search', function (req, res) {
  var s = req.query.search
  var query = "SELECT * from  voiture where marque like '%" + s + "%' or modele like '%" + s + "%'   or matricule like '%" + s + "%'"

  console.log(query);
  connection.query(query, function (error, results, fields) {
    res.render('voitures', { list: results, listLength: results.length });
  });

});

router.post('/delete', function (req, res ) {
  
  connection.query('delete  from  voiture where id =' + req.body.idValue, function (error, results, fields) {
    res.redirect('/voitures');
  });

});






router.post('/upsert', function (req, res ) {
 // condidion ? ins1:ins2 
  var obj = req.body;
  var datavoiture = []
// obj.id!=null obj.id 
  datavoiture[0] = obj.id!==null ? obj.id : 0
  datavoiture[1] = obj.matricule
  datavoiture[2] = obj.marque
  datavoiture[3] = obj.modele
  datavoiture[4] = obj.prixJr
  datavoiture[5] = obj.age

	


  
  var query = mysql.format("INSERT INTO voiture (id,matricule,marque,modele,prixJr,age) values ( ?,  ?,  ?,  ?, ? , ? )  " +
    " ON DUPLICATE KEY UPDATE matricule=values(matricule),marque=values(marque),modele=values(modele),prixJr=values(prixJr),age=values(age) "
    , datavoiture);
  console.log(query);
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/voitures')
  });

});



module.exports = router;
