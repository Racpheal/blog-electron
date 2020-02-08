const { ipcMain } = require('electron');
const KeywordService = require('../../services/blog/keyword');

module.exports = class KeywordController {
  constructor() {
    this.keywordService = new KeywordService();
  }

  register() {
    ipcMain.on('get_keywords', (event, bid) => {
      this.keywordService.getKeywords((data) => {
        const keywords = [];
        for (const item of data) {
          if (item.keywords === null || item.keywords === undefined || item.keywords === '') {
            continue;
          }
          for (const keyword of item.keywords.split(',')) {
            if (keywords.includes(keyword)) {
              continue;
            }
            keywords.push(keyword);
          }
        }
        event.returnValue = keywords;
      });
    });
  }
};
