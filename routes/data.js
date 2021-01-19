const express = require('express');

const router = express.Router();
const fs = require('fs');

/* GET data listing. */
router.get('/:file', (req, res, next) => {
  // send contents of data file
  try {
    const rawData = fs.readFileSync(`${process.env.DATA_DIR + req.params.file}.json`);
    res.status(200).send(rawData);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
