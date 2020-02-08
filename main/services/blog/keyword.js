const Sqlite = require('../../library/sqlite');

module.exports = class KeywordService {
  constructor() {
    this.sqlite = new Sqlite(`${__dirname}/../../static/blog.db`);
  }

  getKeywords(callback) {
    const sql = `
      SELECT keywords FROM t_blog;
    `;
    this.sqlite.select(sql, (data) => {
      callback(data);
    });
  }
};
