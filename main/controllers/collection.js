const { ipcMain } = require('electron');
const CollectionService = require('../services/collection');

module.exports = class PostCollectionController {
  constructor() {
    this.collectionService = new CollectionService();
  }

  register() {
    ipcMain.on('get_post_list', (event, arg) => {
      this.collectionService.getPostList((result) => {
        event.returnValue = {
          status: true,
          data: result,
        };
      });
    });

    ipcMain.on('get_deleted_posts', (event) => {
      this.collectionService.getDeletedPosts((result) => {
        event.returnValue = {
          status: true,
          data: result,
        };
      });
    });
  }
};
