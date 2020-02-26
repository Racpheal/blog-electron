/**
 * 文章集合处理类
 */

const uuid = require('uuid');
const Sqlite = require('../library/sqlite');

module.exports = class CollectionService {
  constructor() {
    this.sqlite = new Sqlite(`${__dirname}/../static/wiki.db`);
  }

  // 获取文章列表结构
  getPostList(callback) {
    const sql = 'SELECT post_id, title, parent_post_id FROM t_posts WHERE is_deleted = 0';
    this.sqlite.select(sql, (data) => {
      callback(data);
    });
  }

  // 获取所有的关键词
  getKeywords(callback) {
    const sql = 'SELECT keywords FROM t_posts WHERE is_deleted = 0';
    this.sqlite.select(sql, (data) => {
      callback(data);
    });
  }

  getDeletedPosts(callback) {
    const sql = 'SELECT * FROM t_posts WHERE is_deleted = 1';
    this.sqlite.select(sql, (data) => {
      callback(data);
    });
  }
};
