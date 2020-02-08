const { ipcMain } = require('electron');
const CategoryService = require('../../services/manage/category');

module.exports = class ManageCategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  register() {
    ipcMain.on('add_parent_category', (event, arg) => {
      this.categoryService.addParentCategory(arg.category_name, (ret) => {
        event.returnValue = ret;
      });
    });

    ipcMain.on('add_sub_category', (event, arg) => {
      this.categoryService.addSubCategory(arg.category_name, arg.parent_category_id, (ret) => {
        event.returnValue = ret;
      });
    });

    ipcMain.on('update_parent_category', (event, arg) => {
      this.categoryService.updateParentCategory(arg.category_name, arg.category_id, (ret) => {
        event.returnValue = ret;
      });
    });

    ipcMain.on('update_sub_category', (event, arg) => {
      this.categoryService.updateSubCategory(arg.category_name, arg.category_id, arg.parent_category_id, (ret) => {
        event.returnValue = ret;
      });
    });

    ipcMain.on('get_categories', (event, arg) => {
      this.categoryService.getCategories((data) => {
        event.returnValue = data;
      });
    });

    ipcMain.on('get_category', (event, cid) => {
      this.categoryService.getCategory(cid, (data) => {
        event.returnValue = data;
      });
    });

    ipcMain.on('get_blogs', (event, arg) => {
      this.categoryService.getBlogs((data) => {
        event.returnValue = data;
      });
    });

    ipcMain.on('get_deleted_blogs', (event, arg) => {
      this.categoryService.getDeletedBlogs((data) => {
        event.returnValue = data;
      });
    });

    ipcMain.on('get_blogs_by_cid', (event, cid) => {
      this.categoryService.getBlogsByCid(cid, (data) => {
        event.returnValue = data;
      });
    });

    ipcMain.on('get_blogs_by_keyword', (event, keyword) => {
      this.categoryService.getBlogsByKeyword(keyword, (data) => {
        event.returnValue = data;
      });
    });

    ipcMain.on('delete_category', (event, arg) => {
      this.categoryService.deleteCategory(arg.category_id, arg.category_level, (ret) => {
        event.returnValue = ret;
      });
    })
  }
};
