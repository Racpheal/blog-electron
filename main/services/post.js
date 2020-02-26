const uuid = require('uuid');
const Sqlite = require('../library/sqlite');

module.exports = class PostService {
  constructor() {
    this.sqlite = new Sqlite(`${__dirname}/../static/wiki.db`);
  }

  // 新建文章
  newPost(postInfo, callback) {
    const postId = uuid.v4();
    const sql = `
      INSERT INTO t_posts('post_id', 'title', 'content', 'summary', 'images', 'keywords', 'parent_post_id')
        VALUES ('${postId}', '${postInfo.title}', '${postInfo.content}', '${postInfo.summary}', '${postInfo.images}', '${postInfo.keywords}', '${postInfo.parent_post_id}') 
    `;
    this.sqlite.run(sql, (data, err) => {
      if (data === null) {
        callback(true, postId);
      } else {
        callback(false, err);
      }
    });
  }

  // 更新文章
  updatePost(postInfo, callback) {
    const sql = `
      UPDATE t_posts SET
        title='${postInfo.title}',
        content='${postInfo.content}',
        summary='${postInfo.summary}',
        images='${postInfo.images}',
        keywords='${postInfo.keywords}'
      WHERE post_id='${postInfo.post_id}'
    `;
    this.sqlite.run(sql, (data, err) => {
      if (data === null) {
        callback(true);
      } else {
        callback(false, err);
      }
    });
  }

  // 获取文章
  getPost(postId, callback) {
    const sql = `SELECT * FROM t_posts WHERE post_id = '${postId}'`;
    this.sqlite.select(sql, (data) => {
      callback(data[0]);
    });
  }

  // 将文章放入回收站（文章的子文章会放到根目录下）
  deletePost(postId, callback) {
    const sql = `
    UPDATE t_posts SET is_deleted='1', parent_post_id='' WHERE post_id = '${postId}';
    UPDATE t_posts SET parent_post_id='' WHERE parent_post_id = '${postId}';
    `;
    this.sqlite.run(sql, (ret, err) => {
      if (ret === null) {
        callback(true, postId);
      } else {
        callback(false, err);
      }
    });
  }

  // 删除文章(只能删除放入回收站的文章)
  dropPost(postId, callback) {
    const sql = `DELETE FROM t_posts WHERE post_id = '${postId}' AND is_deleted = 1`;
    this.sqlite.run(sql, (ret, err) => {
      if (ret === null) {
        callback(true, postId);
      } else {
        callback(false, err);
      }
    });
  }

  // 恢复文章
  recyclePost(postId, callback) {
    const sql = `UPDATE t_posts SET is_deleted = 0 WHERE post_id = '${postId}' AND is_deleted = 1`;
    this.sqlite.run(sql, (ret, err) => {
      if (ret === null) {
        callback(true, postId);
      } else {
        callback(false, err);
      }
    });
  }

  movePost(postId, toPostId, callback) {
    const sql = `UPDATE t_posts SET parent_post_id = '${toPostId}' WHERE post_id = '${postId}' AND is_deleted = 0`;
    this.sqlite.run(sql, (ret, err) => {
      if (ret === null) {
        callback(true, postId);
      } else {
        callback(false, err);
      }
    });
  }
};
