var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET sounds listing. */
router.get('/', function(req, res, next) {

  // send contents of sounds folder
  const raw_data = fs.readdirSync(process.env.SOUNDS_DIR);
  res.status(200).send(raw_data);
});

router.post('/upload', function(req, res, next) {

  if (!req.files) {
    return res.status(400).send({ msg: "No file was uploaded" })
  }

  // accessing the file
  const myFile = req.files.file;

  // verify the file is valid
  if (!myFile.name.endsWith('.mp3') || myFile.mimetype !== 'audio/mpeg') {
    return res.status(400).send({ msg: "File uploaded isn't a correct format. Must be a .mp3 file" })
  }

  //  mv() method places the file inside public directory
  myFile.mv(`${process.env.SOUNDS_DIR}${myFile.name}`, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occurred: Unable to move file to bot dir" });
    }
    // returning the response with file path and name
    return res.status(201).send({ name: myFile.name});
  });
});

module.exports = router;
