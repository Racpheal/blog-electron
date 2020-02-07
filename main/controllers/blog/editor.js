const { ipcMain } = require('electron');
const BlogEditorService = require('../../services/blog/editor');

module.exports = class BlogEditorController {
  constructor() {
    this.blogEditorService = new BlogEditorService();
  }

  register() {
    ipcMain.on('save_blog', (event, arg) => {
      this.blogEditorService.saveBlog(arg, (ret, blogId) => {
        event.returnValue = {
          ret,
          blog_id: blogId,
        };
      });
    });

    ipcMain.on('get_blog', (event, bid) => {
      this.blogEditorService.getBlog(bid, (data) => {
        event.returnValue = data;
      });
    });
  }
};
