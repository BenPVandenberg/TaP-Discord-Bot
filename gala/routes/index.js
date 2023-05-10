const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200);

  res.send();
});

module.exports = router;
