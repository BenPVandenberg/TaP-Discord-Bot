module.exports = {
  getRandomColor() {
    const h = (360 * Math.random()) / 360;
    const s = (100 * Math.random()) / 100;
    const l = (30 + 70 * Math.random()) / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  makeSQLQuery(query) {
    const mysql = require('mysql');

    const con = mysql.createConnection({
      host: 'discordbot-db.cnc9sfn08jc5.us-east-2.rds.amazonaws.com',
      user: 'admin',
      password: process.env.DB_PASSWORD,
      database: 'Discord_Bot',
      timezone: 'EST',
    });

    con.query('SET time_zone = "EST";', function(err) {
      if (err) throw err;

      con.query(query, function(err) {
        if (err) throw err;
      });
    });
  },

  dbMakeSoundLog(soundName, requestor) {
    try {
      this.makeSQLQuery(`INSERT IGNORE INTO Sound (Name) VALUES ('${soundName}');`);
      this.makeSQLQuery(`INSERT IGNORE INTO PlayLog (Requestor, Sound) VALUES (${requestor}, '${soundName}');`);
    }
    catch (e) {
      console.error(e);
    }
  },
};
