var express = require('express');
var router = express.Router();
var debug = require('debug')('jqaas:index');
var spawn = require('child_process').spawn;
var request = require('request');

function jqresp(input, req, res, next) {
  jq = spawn('jq', [req.params.filter], { stdio: ['pipe', 'pipe', 'pipe'] })
  jq.stdin.write(new Buffer(input));
  jq.stdin.end();
  jqdata = "";
  jqerr = "";
  jq.stdout.on('data', function (data) {
    jqdata += data.toString();
  });
  jq.stderr.on('data', function (data) {
    jqerr += data.toString();
  });
  jq.on('close', function (code) {
    if (jqdata == "") jqdata = '""';
    if (req.query.raw == "true") {
      res.set('Content-Type', 'application/json');
      object = jqdata;
    } else {
      object = {
        result: JSON.parse(jqdata),
        error: jqerr,
        code: code
      };
    }
    res.send(object);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/:filter', function(req, res, next) {
  if (req.query.get) {
    request({url: req.query.get, headers: {'User-Agent': 'request'}}, function(error, response, body) {
      jqresp(body.toString(), req, res, next);
    });
  } else {
    res.end();
  }
});

/* POST home page. */
router.post('/:filter', function(req, res, next) {
  jqresp(JSON.stringify(req.body), req, res, next);
});

module.exports = router;
