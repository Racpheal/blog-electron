const { ipcMain } = require('electron');
const PostService = require('../services/post');

module.exports = class PostController {
  constructor() {
    this.postService = new PostService();
  }

  register() {
    ipcMain.on('new_post', (event, arg) => {
      this.postService.newPost(arg, (ret, result) => {
        event.returnValue = {
          status: ret,
          data: result,
        };
      });
    });

    ipcMain.on('update_post', (event, arg) => {
      this.postService.updatePost(arg, (ret, result) => {
        event.returnValue = {
          status: ret,
          data: result,
        };
      });
    });

    ipcMain.on('get_post_by_post_id', (event, postId) => {
      this.postService.getPost(postId, (postInfo) => {
        event.returnValue = {
          status: true,
          data: postInfo,
        };
      });
    });

    ipcMain.on('delete_post', (event, postId) => {
      this.postService.deletePost(postId, (ret, result) => {
        event.returnValue = {
          status: ret,
          data: result,
        };
      });
    });

    ipcMain.on('drop_post', (event, postId) => {
      this.postService.dropPost(postId, (ret, result) => {
        event.returnValue = {
          status: ret,
          data: result,
        };
      });
    });

    ipcMain.on('recycle_post', (event, postId) => {
      this.postService.recyclePost(postId, (ret, result) => {
        event.returnValue = {
          status: ret,
          data: result,
        };
      });
    });

    ipcMain.on('move_post', (event, postId, toPostId) => {
      this.postService.movePost(postId, toPostId, (ret, result) => {
        event.returnValue = {
          status: ret,
          data: result,
        }
      });
    });
  }
};
