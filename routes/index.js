var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Espace de Gestion de location des voitures', date:new Date() } );
});

module.exports = router;
