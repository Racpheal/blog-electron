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

    ipcMain.on('delete_blog', (event, bid) => {
      this.blogEditorService.deleteBlog(bid, (ret) => {
        event.returnValue = ret;
      });
    });

    ipcMain.on('drop_blog', (event, bid) => {
      this.blogEditorService.dropBlog(bid, (ret) => {
        event.returnValue = ret;
      });
    });

    ipcMain.on('recycle_blog', (event, bid) => {
      this.blogEditorService.recycleBlog(bid, (ret) => {
        event.returnValue = ret;
      });
    });
  }
};
