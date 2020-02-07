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
      INSERT INTO t_blog('blog_id', 'category_id', 'title', 'content', 'summary', 'images')
        VALUES ('${blogId}' , '${blogInfo.category_id}', '${blogInfo.title}', '${blogInfo.content}', '${blogInfo.summary}', '${blogInfo.images}') 
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
      WHERE t_blog.blog_id = '${blogId}'
    `;
    this.sqlite.select(sql, (data) => {
      callback(data[0]);
    });
  }
};
