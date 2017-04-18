var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/qm/:cmd', function(req, res, next) {
  console.log(req.params.cmd);
  res.json(req.body.data);
});

router.post('/api/qm/signin', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  console.log('username:' + username);
  console.log('password:' + password);
  if (username === 'admin' && password === 'admin') {
    res.json({
      code: 0,
      error: '',
      body: {
        token: '1234567890'
      }
    })
  } else {
    res.json({
      code: 1,
      error: 'username or password error!',
    })
  }
});

router.post('/posts', function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
