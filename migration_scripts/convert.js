const fs = require('fs');

const GAME_PATH= './data/game.json'
const VOICE_PATH= './data/voice.json'

function fetch_games() {
    const game_data = JSON.parse(fs.readFileSync(GAME_PATH))
    const all_games = [];

    for (const user in game_data) {
        for (const game in game_data[user]['gameLogs']) {
            const title = game_data[user]['gameLogs'][game]['name'].trim()
            const existing_log = all_games.find(e => e.Title === title)

            if (!existing_log) all_games.push({ Title: title, GameID: (game.trim() === title) ? null : parseInt(game.trim())})
            else if (existing_log.GameID === null) existing_log.GameID = parseInt(game.trim())
        }
    }

    fs.writeFileSync('./games.json', JSON.stringify(all_games));
}

function fetch_users() {
    const game_data = JSON.parse(fs.readFileSync(GAME_PATH))
    const voice_data = JSON.parse(fs.readFileSync(VOICE_PATH))
    const all_users = [];

    for (const user in game_data) {
        const identity = game_data[user]['identity']
        all_users.push({ UserID: parseInt(user),  DisplayName: identity['displayName'], Username: identity['username'], Discriminator: parseInt(identity['discriminator'])})
    }

    for (const user in voice_data) {
        if (all_users.find(e => e.UserID === parseInt(user)) === undefined) {
            const identity = voice_data[user]['identity']
            all_users.push({ UserID: parseInt(user),  DisplayName: identity['displayName'], Username: identity['username'], Discriminator: parseInt(identity['discriminator'])})
        }
    }

    fs.writeFileSync('./users.json', JSON.stringify(all_users));
}

function fetch_game_logs() {
    const game_data = JSON.parse(fs.readFileSync(GAME_PATH))
    const all_logs = [];
    let prev_start = null;

    for (const user in game_data) {
        for (const game in game_data[user]['gameLogs']) {
            const gameName = game_data[user]['gameLogs'][game]['name'].trim()
            prev_start = null;

            for (const log of game_data[user]['gameLogs'][game]['events']) {
                if (log['type'] === 'start') prev_start = log;
                if (log['type'] === 'stop' && prev_start !== null) {
                    all_logs.push({ UserID: parseInt(user), Game: gameName, Start: prev_start['timestamp'], End: log['timestamp'] })
                    prev_start = null;
                }
            }
        }
    }

    fs.writeFileSync('./game_logs.json', JSON.stringify(all_logs));
}

function fetch_voice_sessions() {
    const voice_data = JSON.parse(fs.readFileSync(VOICE_PATH))
    const all_logs = [];

    for (const user in voice_data) {
        for (const session of voice_data[user]['sessions']) {
            if (!all_logs.find(e => e.SessionID === session['sessionID'])) all_logs.push({ UserID: parseInt(user), SessionID: session['sessionID'] })
        }
    }

    fs.writeFileSync('./voice_sessions.json', JSON.stringify(all_logs));
}

function fetch_voice_channels() {
    const voice_data = JSON.parse(fs.readFileSync(VOICE_PATH))
    const all_channels = [];

    for (const user in voice_data) {
        for (const session of voice_data[user]['sessions']) {
            for (const event of session['events']) {
                const existing_log = all_channels.find(e => e.ChannelID === parseInt(event['channelID']))

                if (!existing_log)
                    all_channels.push({ ChannelID: parseInt(event['channelID']), ChannelName: event['channelName']})
                else {
                    existing_log.ChannelName = event['channelName']
                }
            }
        }
    }

    fs.writeFileSync('./voice_channels.json', JSON.stringify(all_channels));
}

function fetch_voice_logs() {
    const voice_data = JSON.parse(fs.readFileSync(VOICE_PATH))
    const all_logs = [];

    for (const user in voice_data) {
        for (const session of voice_data[user]['sessions']) {
            let prev_join = null;
            for (const event of session['events']) {
                if (event.type === 'join') prev_join = event

                else if (event.type === 'leave' && prev_join !== null && event.channelID === prev_join.channelID) {
                    all_logs.push({ SessionID: session['sessionID'], ChannelID: parseInt(event.channelID), start: prev_join['timestamp'], end: event['timestamp'] })
                    prev_join = null;
                }
            }
        }
    }

    fs.writeFileSync('./voice_logs.json', JSON.stringify(all_logs));
}

// fetch_games()
// fetch_users()
// fetch_game_logs()
// fetch_voice_sessions()
fetch_voice_channels()
// fetch_voice_logs()
