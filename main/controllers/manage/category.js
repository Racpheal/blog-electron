const { ipcMain } = require('electron');
const CategoryService = require('../../services/manage/category');

module.exports = class ManageCategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  register() {
    ipcMain.on('add_category', (event, arg) => {
      this.categoryService.addCategory(arg.level, arg.name);
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

    ipcMain.on('get_blogs_by_cid', (event, cid) => {
      this.categoryService.getBlogsByCid(cid, (data) => {
        event.returnValue = data;
      });
    });
  }
};
