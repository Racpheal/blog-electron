const Sqlite = require('../../library/sqlite');

module.exports = class CategoryService {
  constructor() {
    this.sqlite = new Sqlite(`${__dirname}/../../static/blog.db`);
  }

  addCategory(level, name) {
    console.log(level, name);
  }

  getCategories(callback) {
    this.sqlite.select(`
      SELECT 
        a.*, 
        b.category_name AS parent_category_name 
      FROM t_category a LEFT JOIN t_category b 
        ON (a.parent_category_id = b.category_id)`, (data) => {
      callback(data);
    });
  }

  getCategory(cid, callback) {
    this.sqlite.select(`SELECT * FROM t_category WHERE category_id = '${cid}'`, (data) => {
      callback(data[0]);
    });
  }

  getBlogs(callback) {
    this.sqlite.select(`
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
      `, (data) => {
      callback(data);
    });
  }

  getBlogsByCid(cid, callback) {
    this.sqlite.select(`
      SELECT 
        t.*, 
        a.category_name, 
        b.category_id AS parent_category_id, 
        b.category_name AS parent_category_name 
      FROM t_blog t
      LEFT JOIN t_category a 
        ON (t.category_id = a.category_id) 
      LEFT JOIN t_category b 
        ON (a.parent_category_id = b.category_id)
      WHERE t.category_id = '${cid}'
        UNION 
      SELECT 
        t.*, 
        a.category_name, 
        b.category_id AS parent_category_id, 
        b.category_name AS parent_category_name 
      FROM t_blog t
      LEFT JOIN t_category a 
        ON (t.category_id = a.category_id) 
      LEFT JOIN t_category b 
        ON (a.parent_category_id = b.category_id)
      WHERE t.category_id IN 
        (SELECT category_id FROM t_category WHERE parent_category_id = '${cid}')
      `, (data) => {
      callback(data);
    });
  }
};
