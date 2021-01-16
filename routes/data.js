var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET data listing. */
router.get('/:file', function(req, res, next) {

  // send contents of data file
  try {
    const raw_data = fs.readFileSync(process.env.DATA_DIR + req.params.file + '.json');
    res.status(200).send(raw_data);

  } catch (e) {
    res.status(400).send({msg: e.message})
  }
  
});

module.exports = router;
