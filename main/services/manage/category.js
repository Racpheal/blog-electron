const Sqlite = require('../../library/sqlite');

module.exports = class CategoryService {
  constructor() {
    this.sqlite = new Sqlite(`${__dirname}/../../static/blog.db`);
  }

  addParentCategory(categoryName, callback) {
    const sql = `INSERT INTO t_category (category_level, category_name)
      VALUES (1, '${categoryName}');`;
    this.sqlite.run(sql, (data, err) => {
      if (data === null) {
        callback(true);
      }
    });
  }

  addSubCategory(categoryName, parentCategoryId, callback) {
    const sql = `INSERT INTO t_category (category_level, category_name, parent_category_id)
      VALUES (2, '${categoryName}', '${parentCategoryId}');`;
    this.sqlite.run(sql, (data, err) => {
      if (data === null) {
        callback(true);
      }
    });
  }

  updateParentCategory(categoryName, categoryId, callback) {
    const sql = `UPDATE t_category SET category_name='${categoryName}' WHERE category_id = '${categoryId}'`
    this.sqlite.run(sql, (data, err) => {
      if (data === null) {
        callback(true);
      }
    });
  }

  updateSubCategory(categoryName, categoryId, parentCategoryId, callback) {
    const sql = `UPDATE t_category SET category_name='${categoryName}', parent_category_id='${parentCategoryId}' WHERE category_id = '${categoryId}'`
    this.sqlite.run(sql, (data, err) => {
      if (data === null) {
        callback(true);
      }
    });
  }

  deleteCategory(categoryId, categoryLevel, callback) {
    this.sqlite.select(`
      SELECT category_id FROM t_category WHERE parent_category_id='${categoryId}'
        UNION
      SELECT category_id FROM t_category WHERE category_id='${categoryId}'`, (data, err) => {
      const categoryIds = data.map(x => x.category_id);
      let sql = `UPDATE t_blog SET category_id=null WHERE category_id IN ('${categoryIds.join("','")}');`;
      sql += `DELETE FROM t_category WHERE parent_category_id='${categoryId}';`;
      sql += `DELETE FROM t_category WHERE category_id='${categoryId}';`
      this.sqlite.run(sql, (data, err) => {
        if (data === null) {
          callback(true);
        }
      });
    });
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
      WHERE t_blog.is_deleted = 0
      `, (data) => {
      callback(data);
    });
  }

  getDeletedBlogs(callback) {
    this.sqlite.select('SELECT * FROM t_blog WHERE is_deleted = 1', (data) => {
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
      WHERE t.category_id = '${cid}' AND t.is_deleted = 0
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
        AND t.is_deleted = 0
      `, (data) => {
      callback(data);
    });
  }
};
