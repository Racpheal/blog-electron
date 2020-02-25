<template>
  <Layout>
    <Row>
      <h1>编辑博客</h1>
      <Divider />
    </Row>
    <Row>
      <h3>编辑内容</h3>
      <div class='header'>
        <Input v-model='postInfo.title' class='input' placeholder="请输入标题"/>
        <Button @click='savePost' type='primary' class='button'>保存</Button>
        <Button @click='showImageContents = true' class='button'>查看包含的图片</Button>
      </div>
      <mavon-editor
        v-model="content" placeholder=" "
        :toolbars='toolbarConfig'
        style="height: 50vh; z-index: 10"
        @change='contentChange'
        @save='savePost'
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
        v-model="postInfo.summary"
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
        <!-- <Option
          v-for="(value, index) in allKeywords"
          :value="value" :key="index">
          {{ value }}
        </Option> -->
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
export default class PostEditor extends Vue {
  private postInfo: any = {
    title: '',
    summary: '',
    keywords: '',
    images: '[]',
    parent_post_id: '',
    content: '',
  };
  private isUpdate: boolean = false;

  private get content() {
    if (this.postInfo.content === undefined) {
      return '';
    }
    return decodeURIComponent(atob(this.postInfo.content));
  }

  private set content(value) {
    this.postInfo.content = btoa(encodeURIComponent(value));
  }

  private imageContent: Array<any> = [];

  private get keywords() {
    if (this.postInfo.keywords === undefined) {
      return [];
    }
    return this.postInfo.keywords.split(',');
  }

  private html: string = '';

  private createSummary: boolean = true;

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

  private beforeMount() {
    this.refresh();
  }

  private refresh() {
    this.isUpdate = false;
    // eslint-disable-next-line max-len
    if (this.$route.query.postId !== undefined && this.$route.query.postId !== null && this.$route.query.postId !== '') {
      this.postInfo = ipcRenderer.sendSync('get_post_by_post_id', this.$route.query.postId).data;
      this.isUpdate = true;
    }
  }

  private mounted() {
    this.imageContent = JSON.parse(this.postInfo.images);
    this.imageContent.forEach((x: any) => {
      (this.$refs.mde as any).markdownIt.image_add(x.imageId, x.base64);
    });
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
  }

  private imgDel(filename: string) {
    const index = this.imageContent.findIndex(x => x.filename === filename);
    this.imageContent.splice(index, 1);
  }

  private savePost() {
    let ret: any;
    this.postInfo.images = JSON.stringify(this.imageContent);
    if (this.isUpdate) {
      ret = ipcRenderer.sendSync('update_post', this.postInfo);
    } else {
      this.postInfo.parent_post_id = this.$route.query.parentPostId;
      ret = ipcRenderer.sendSync('new_post', this.postInfo);
      this.$route.query.postId = ret.data;
    }
    if (ret.status) {
      this.$Notice.success({
        title: '保存成功',
        duration: 3,
      });
      this.$store.state.refresh();
      this.refresh();
    } else {
      this.$Notice.error({
        title: '保存失败',
        duration: 5,
        desc: ret.data,
      });
    }
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
