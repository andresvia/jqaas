var express = require('express');
var router = express.Router();
var debug = require('debug')('jqaas:index');
var spawn = require('child_process').spawn;
var request = require('request');

function jqresp(input, req, res, next) {
  if (req.query.filter) {
    var jq = spawn('jq', ['-r', req.query.filter])
    jq.on('error', function(error) {
      // should send a '500 Internal Server Error' here
      debug(error);
      debug("Consider setting JQ_DOWNLOAD_URL env var");
    });
    jq.stdin.write(new Buffer(input));
    jq.stdin.end();
    var jqdata = "";
    var jqerr = "";
    jq.stdout.on('data', function (data) {
      jqdata += data.toString();
    });
    jq.stderr.on('data', function (data) {
      jqerr += data.toString();
    });
    jq.on('close', function (code) {
      if (jqdata == "") jqdata = '""';
      res.set('X-Return-Code', code);
      if (code == 0) {
        if (IsJsonString(jqdata)) {
          res.set('Content-Type', 'application/json')
        }
        res.status(200).send(jqdata);
      } else {
        res.status(400).send(jqerr);
      }
    });
  } else {
    res.status(400).send("Set 'filter' parameter\n");
  }
}

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.query.get) {
    request({url: req.query.get, headers: {'User-Agent': req.get('User-Agent')}}, function(error, response, body) {
      if (error) {
	res.status(400).send(error.toString() + "\n");
      } else {
        jqresp(body.toString(), req, res, next);
      }
    });
  } else {
    res.status(400).send("Set 'get' parameter\n");
  }
});

/* POST home page. */
router.post('/', function(req, res, next) {
  jqresp(JSON.stringify(req.body), req, res, next);
});

module.exports = router;
