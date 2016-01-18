var express = require('express');
var router = express.Router();
var debug = require('debug')('jqaas:index');
var spawn = require('child_process').spawn;
var request = require('request');

/* GET */
router.get('/', (req, res) => {
  if (req.query.get) {
    var jq = spawn('jq', ['-r', req.query.filter])
    jq.on('error', function(error) {
      debug(error);
    });
    request({url: req.query.get, headers: {'User-Agent': req.get('User-Agent')}}, function(error) {
      if (error) {
        res.status(400).send(error.toString() + "\n");
      }
    }).pipe(jq.stdin);
    jq.stdout.on('data', function (data) {
      res.write(data);
    });
    jq.stderr.on('data', function (data) {
      res.write(data);
    });
    jq.on('close', function (code) {
      res.end();
    });
  } else {
    res.status(400).send(`
      <form method='get'>
      <input name='get' size='50' placeholder='JSON URL http://...'> |
      <input name='filter' size='50' placeholder='jq filter .'>
      <input type='submit' value='go'>
      </form>
    `);
  }
});

module.exports = router;
