var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/route1', function(req, res, next) {
  res.send('route 1reponse');
});
module.exports = router;
