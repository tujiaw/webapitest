var express = require('express');
var md5 = require('blueimp-md5/js/md5');
var router = express.Router();

router.post('/qm/login', function(req, res, next) {
  const data = JSON.parse(req.body.data);
  console.log('username:' + data.loginName);
  console.log('password:' + data.password);
  const md5admin = md5('admin');
  if (data.loginName === 'admin' && data.password === md5admin) {
    res.json({
      code: 0,
      error: '',
      body: {
        result: 0,
        token: '1234567890'
      }
    })
  } else {
    res.json({
      code: 1,
      error: 'username or password error!',
      body: {
        result: 1
      }
    })
  }
});

router.post('/qm/:cmd', function(req, res, next) {
  console.log(req.params.cmd);
  res.json(JSON.parse(req.body.data));
});

router.post('/posts', function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
