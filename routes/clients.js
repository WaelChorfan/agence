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
  connection.query('SELECT * from  client', function (error, results, fields) {
    res.render('clients', { list: results, listLength: results.length });
  });

});

router.post('/search', function (req, res) {
  var s = req.body.search
  var query = "SELECT * from  client where nom like '%" + s + "%' or prenom like '%" + s + "%'   or cin like '%" + s + "%'"

  console.log(query);
  connection.query(query, function (error, results, fields) {
    res.render('clients', { list: results, listLength: results.length });
  });

});

router.get('/search', function (req, res) {
  var s = req.query.search
  var query = "SELECT * from  client where nom like '%" + s + "%' or prenom like '%" + s + "%'   or cin like '%" + s + "%'"

  console.log(query);
  connection.query(query, function (error, results, fields) {
    res.render('clients', { list: results, listLength: results.length });
  });

});

router.post('/delete', function (req, res ) {
  
  connection.query('delete  from  client where id =' + req.body.idValue, function (error, results, fields) {
    res.redirect('/clients');
  });

});






router.post('/upsert', function (req, res ) {
 // condidion ? ins1:ins2 
  var obj = req.body;
  var dataClient = []
// obj.id!=null obj.id 
  dataClient[0] = obj.id!==null ? obj.id : 0
  dataClient[1] = obj.cin
  dataClient[2] = obj.nom
  dataClient[3] = obj.prenom
  dataClient[4] = obj.tel


  var query = mysql.format("INSERT INTO client (id,cin,nom,prenom,tel) values ( ?,  ?,  ?,  ?,  ? )  " +
    " ON DUPLICATE KEY UPDATE cin=values(cin),nom=values(nom),prenom=values(prenom),tel=values(tel) "
    , dataClient);
  console.log(query);
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/clients')
  });

});



module.exports = router;
