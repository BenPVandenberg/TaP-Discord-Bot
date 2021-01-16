var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {

  // send contents of sounds folder
  const raw_data = fs.readdirSync(process.env.SOUNDS_DIR);
  res.send(raw_data);
});

router.post('/upload', function(req, res, next) {

  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" })
  }

  // accessing the file
  const myFile = req.files.file;

  //  mv() method places the file inside public directory
  myFile.mv(`${process.env.SOUNDS_DIR}${myFile.name}`, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occurred" });
    }
    // returning the response with file path and name
    return res.send({ name: myFile.name, path: `/${myFile.name}` });
  });
});

module.exports = router;
