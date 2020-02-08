<template>
  <Layout>
    <Row>
      <h1>编辑博客</h1>
      <Divider />
    </Row>
    <Row>
      <h3>设置分类</h3>
      <RadioGroup v-model="selectedCategoryId">
        <Radio
          v-for='category in categories.filter(x => x.category_level === 2)'
          :label='category.category_id'
          :key='category.category_id'
          class='radio_item'>
          {{ `${category.parent_category_name} >> ${category.category_name}` }}
        </Radio>
        <Radio class='radio_item' label=''>无分类</Radio>
      </RadioGroup>
      <Divider />
    </Row>
    <Row>
      <h3>编辑内容</h3>
      <div class='header'>
        <Input v-model='title' class='input' placeholder="请输入标题"/>
        <Button @click='saveBlog' type='primary' class='button'>保存</Button>
        <Button @click='showImageContents = true' class='button'>查看包含的图片</Button>
      </div>
      <mavon-editor
        v-model="content" placeholder=" "
        :toolbars='toolbarConfig'
        @save='saveBlog'
        style="height: 50vh; z-index: 10"
        @change='contentChange'
        ref='mde'
        :tabSize='2'
        codeStyle='vs'
        @imgAdd="imgAdd"
        @imgDel='imgDel'/>
      <Divider />
    </Row>
    <Row>
      <h3>设置摘要</h3>
      <Checkbox
        style='display: block'
        v-model="createSummary">摘要</Checkbox>
      <Input style='margin-top: 10px;'
        v-if='createSummary'
        type='textarea'
        v-model="summary"
        placeholder="请输入摘要"
        :autosize='{ minRows: 2, maxRows: 6 }'/>
        <Divider />
    </Row>
    <Row>
      <h3>设置关键词</h3>
      <Select
        v-model="keywords"
        filterable
        multiple
        allow-create
        placeholder='请输入关键词'>
        <Option
          v-for="(value, index) in allKeywords"
          :value="value" :key="index">
          {{ value }}
        </Option>
      </Select>
    </Row>
    <Drawer
      title="包含的图片"
      :closable="false"
      v-model="showImageContents"
      transfer
      width='300'
      style='text-align: center'>
      <li v-for='img in imageContent' :key='img.filename' style='list-style-type: none'>
        <Avatar
          shape="square"
          :src="img.base64"
          size='200'
          style='margin-bottom: 20px;'/>
          <p>{{img.filename}}&nbsp;&nbsp;<a href='#' @click='imgDel(img.filename)'>删除</a></p>
      </li>
    </Drawer>
  </Layout>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

const uuid = require('uuid');

const { ipcRenderer } = (window as any).require('electron');

@Component
export default class ManageEditor extends Vue {
  private content: string = '';

  private title: string = '';

  private html: string = '';

  private categories: Array<any> = [];

  private selectedCategoryId: string = '';

  private createSummary: boolean = true;

  private summary: string = '';

  private keywords: Array<string> = [];

  private allKeywords: Array<string> = [];

  private blogId: string = '-1';

  private imageContent: Array<any> = [];

  private showImageContents: boolean = false;

  private toolbarConfig: object = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    htmlcode: true, // 展示html源码
    help: true, // 帮助
    /* 1.3.5 */
    undo: true, // 上一步
    redo: true, // 下一步
    save: true, // 保存（触发events中的save事件）
    /* 1.4.2 */
    navigation: true, // 导航目录
    /* 2.1.8 */
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    /* 2.2.1 */
    subfield: true, // 单双栏模式
  };

  constructor() {
    super();
    this.categories = ipcRenderer.sendSync('get_categories');
  }

  private beforeMount() {
    this.blogId = '';
    this.imageContent = [];
    // eslint-disable-next-line max-len
    if (this.$route.query.bid !== undefined && this.$route.query.bid !== null && this.$route.query.bid !== '') {
      this.blogId = this.$route.query.bid.toString();
      const data = ipcRenderer.sendSync('get_blog', this.blogId);
      console.log(data);
      this.title = data.title;
      this.content = decodeURIComponent(atob(data.content));
      this.summary = data.summary;
      this.selectedCategoryId = data.category_id;
      this.imageContent = JSON.parse(data.images);
      this.keywords = data.keywords.split(',');
    }
    this.allKeywords = ipcRenderer.sendSync('get_keywords');
    console.log(this.allKeywords);
  }

  private mounted() {
    console.log(this.$refs.mde);
    this.imageContent.forEach((x) => {
      (this.$refs.mde as any).markdownIt.image_add(x.imageId, x.base64);
    });
  }

  private saveBlog(): void {
    if (this.title.length === 0) {
      this.$Notice.error({
        title: '请输入标题',
        duration: 5,
      });
      return;
    }
    const ret = ipcRenderer.sendSync('save_blog', {
      title: this.title,
      content: btoa(encodeURIComponent(this.content)),
      images: JSON.stringify(this.imageContent),
      category_id: this.selectedCategoryId,
      summary: this.summary,
      blog_id: this.blogId,
      keywords: this.keywords.join(','),
    });
    if (ret.ret) {
      this.$Notice.success({
        title: '保存成功！',
        duration: 5,
      });
      this.blogId = ret.blog_id;
    }
  }

  private contentChange(value: string, render: string): void {
    this.html = render;
  }

  private imgAdd(pos: string, file: any) {
    const imageId = uuid.v4();
    this.imageContent.push({
      imageId,
      filename: file.name,
      base64: file.miniurl,
    });
    (this.$refs.mde as any).$img2Url(pos, imageId);
    // eslint-disable-next-line no-underscore-dangle
    (this.$refs.mde as any).markdownIt.__image = {};
    this.imageContent.forEach((x) => {
      // eslint-disable-next-line no-underscore-dangle
      (this.$refs.mde as any).markdownIt.image_add(x.imageId, x.base64);
    });
    console.log(this.$refs.mde);
  }

  private imgDel(filename: string) {
    const index = this.imageContent.findIndex(x => x.filename === filename);
    this.imageContent.splice(index, 1);
  }
}
</script>

<style lang="less" scoped>
h3 {
  margin-bottom: 10px;
}

.header {
  margin-bottom: 10px;
}

.input {
  float: left;
  width: 70%;
}

.button {
  margin-left: 10px;
}

.radio_item {
  margin-right: 10px;
}
</style>
