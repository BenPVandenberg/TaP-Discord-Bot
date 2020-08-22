// const Discord = require('discord.js');
// const config = require('../config.json');
const spawn = require("child_process").spawn
const pythonProcess = spawn('python',["../pythonScripts/friendly.py",])
const BSON = require('bson')


let  starData = []

// top10.js
// ========

let getStars = async() => {

    pythonProcess.stdout.on('data', (data) => {
        let stringData = data.toString()
        let JsonData = JSON.parse(stringData)

        // starData.push(JsonData)
        console.log("show me the money", JsonData)

    });




}

getStars()
// module.exports = {
//   name: 'top10',
//   description: 'your next "bathroom" break',
//   execute(message, args) {
//     pythonProcess.stdout.on('data', (data) => {
//         starData = data
//     });

//     const starString

//     const rank_config = config.commands.rank;
//     const importantInfo = new Discord.MessageEmbed()
//       .setColor('#0099ff')
//       .addField('( ͡° ͜ʖ ͡°)', all_ranks_string, false);
//     }
// };