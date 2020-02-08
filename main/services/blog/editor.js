const uuid = require('uuid');
const Sqlite = require('../../library/sqlite');

module.exports = class BlogEditorService {
  constructor() {
    this.sqlite = new Sqlite(`${__dirname}/../../static/blog.db`);
  }

  saveBlog(blogInfo, callback) {
    let blogId = uuid.v4();
    if (blogInfo.blog_id !== null && blogInfo.blog_id !== undefined && blogInfo.blog_id !== '' && blogInfo.blog_id.toString() !== '-1') {
      blogId = blogInfo.blog_id;
    }
    const sql = `
      DELETE FROM t_blog WHERE blog_id = '${blogId}';
      INSERT INTO t_blog('blog_id', 'category_id', 'title', 'content', 'summary', 'images', 'keywords')
        VALUES ('${blogId}' , '${blogInfo.category_id}', '${blogInfo.title}', '${blogInfo.content}', '${blogInfo.summary}', '${blogInfo.images}', '${blogInfo.keywords}') 
    `;
    this.sqlite.run(sql, (data, err) => {
      if (data === null) {
        callback(true, blogId);
      }
    });
  }

  getBlog(blogId, callback) {
    const sql = `
      SELECT 
        t_blog.*,
        a.category_name, 
        b.category_id AS parent_category_id, 
        b.category_name AS parent_category_name 
      FROM t_blog 
      LEFT JOIN t_category a 
        ON (t_blog.category_id = a.category_id) 
      LEFT JOIN t_category b 
        ON (a.parent_category_id = b.category_id)
      WHERE t_blog.blog_id = '${blogId}' AND t_blog.is_deleted = 0
    `;
    this.sqlite.select(sql, (data) => {
      callback(data[0]);
    });
  }
  
  deleteBlog(blogId, callback) {
    const sql = `UPDATE t_blog SET is_deleted='1', category_id=null WHERE blog_id = '${blogId}'`;
    this.sqlite.run(sql, (ret) => {
      if (ret === null) {
        callback(true, blogId);
      }
    });
  }

  dropBlog(blogId, callback) {
    const sql = `DELETE FROM t_blog WHERE blog_id = '${blogId}' AND is_deleted = 1`;
    this.sqlite.run(sql, (ret) => {
      if (ret === null) {
        callback(true, blogId);
      }
    });
  }

  recycleBlog(blogId, callback) {
    const sql = `UPDATE t_blog SET is_deleted='0' WHERE blog_id = '${blogId}'`;
    this.sqlite.run(sql, (ret) => {
      if (ret === null) {
        callback(true, blogId);
      }
    });
  }
};
