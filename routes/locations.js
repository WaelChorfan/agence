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


router.get('/',  function (req, res) {

  var query=  'SELECT location.id as idLocation, location.idV as idVoiture,location.idC as idClient,' 
  +' DATE_FORMAT(location.start  , "%M %d %Y")  as debut,DATE_FORMAT(location.end  , "%M %d %Y") as fin,  (location.end-location.start) as nbrJours , '
  +' voiture.matricule as matricule, client.cin as cin ,  '
  +'(location.end-location.start)*voiture.prixJr  as prixTotal FROM  location ' 
  +' INNER JOIN  voiture on voiture.id=location.idV INNER JOIN  client on client.id=location.idC '
 
   var querylistVoitures = 'SELECT id as idVOITURE , matricule from voiture where id not in (select idV from location)'
   
   var querylistClients ='select id as idCLIENT,cin from client'

  connection.query( query,function( err, results,fields )  {
    
    connection.query( querylistClients,( err, listClients,fields ) => {
    connection.query( querylistVoitures,( err,listVoitures ,fields) => {
        
        console.log(results)
        console.log(listClients)
        console.log(listVoitures)

        res.render('locations', {
          list: results, listLength: results.length 
          , listClients: listClients, listClientsLength: listClients.length 
          ,listVoitures: listVoitures, listVoituresLength: listVoitures.length 
        
        });

      }); 
    }); 
  }); 


});

router.post('/search', function (req, res) {
  
  var s = req.body.search
  var query = "SELECT * from  location where marque like '%" + s + "%' or modele like '%" + s + "%'   or matricule like '%" + s + "%'"

  console.log(query);
  connection.query(query, function (error, results, fields) {
    res.render('locations', { list: results, listLength: results.length });
  });

});

router.post('/delete', function (req, res ) {
  console.log('delete  from  location where id =' + req.body.idLocation)
  connection.query('delete  from  location where id =' + req.body.idLocation, function (error, results, fields) {
    res.redirect('/locations');
  });

});


//insert or update selon 
router.post('/upsert', function (req, res ) {
  var obj = req.body;
  var datalocation = []

  console.log(obj)
  datalocation[0] = obj.id ? obj.id : 0
  datalocation[1] = obj.idClient
  datalocation[2] = obj.idVoiture
  datalocation[3] = obj.start
  datalocation[4] = obj.end

	console.log(datalocation)


  
  var query = mysql.format("INSERT INTO location (id,idC,idV,start,end) values ( ?,  ?,  ?,  ?, ?  )  " +
    " ON DUPLICATE KEY UPDATE idV=values(idV),idC=values(idC),start=values(start),end=values(end) "
    , datalocation);
  console.log(query);
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.redirect('/locations')
  });

});



module.exports = router;
