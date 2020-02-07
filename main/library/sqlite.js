const sqlite = require('sqlite3').verbose();

module.exports = class Sqlite {
  constructor(file) {
    this.file = file;
  }

  run(sql, callback) {
    const db = new sqlite.Database(this.file);
    db.exec(sql, (ret, err) => {
      if (err !== null && err !== undefined) {
        console.log(err);
      }
      db.close();
      callback(ret, err);
    });
  }

  select(sql, callback) {
    const db = new sqlite.Database(this.file);
    db.all(sql, (err, rows) => {
      if (err !== null) {
        console.log(`Error Message: ${err.message}`);
        return;
      }
      db.close();
      callback(rows);
    });
  }
};
