<template>
  <div>
    <h1>{{ postInfo.title }}</h1>
    <Divider />
    <div class='toolbar'>
      <a href='#' @click='edit()'>编辑</a>
      <Divider type="vertical" />
      <a href='#' @click='create()'>新建</a>
      <Divider type="vertical" />
      <a href='#' @click='remove()'>删除</a>
      <Divider type="vertical" />
      <a href='#' @click='moveModal=true'>移动</a>
      <Divider type="vertical" />
      <a href='#' @click='navigationClick()'>目录</a>
      <Divider type="vertical" />
      <a href='#' @click='fullScreenClick()'>全屏浏览</a>
    </div>
    <mavon-editor
      style="height: 85vh; z-index: 10;"
      :toolbars='{}'
      defaultOpen='preview'
      :editable='false'
      :subfield='false'
      :navigation='true'
      :boxShadow='false'
      :transition='false'
      :toolbarsFlag='false'
      ref='mde'
      v-model="content"/>
    <Modal v-model='moveModal' title="移动到..." @on-ok="move">
      <div>
        <Tree :data='treeData' ref='moveTree'></Tree>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

const { ipcRenderer } = (window as any).require('electron');

@Component
export default class PostView extends Vue {
  private moveModal: boolean = false;
  private postInfo: any = {};
  private postLists: Array<any> = [];
  private get treeData(): Array<any> {
    const getChildren = (postId: string|null): Array<any> => {
      const temp: Array<any> = [];
      const nodes = this.postLists.filter((x: any) => x.parent_post_id === postId);
      nodes.forEach((x: any) => {
        const data = {
          title: x.title,
          postId: x.post_id,
          expend: false,
          disabled: false,
          children: getChildren(x.post_id),
        };
        if (data.postId === this.postInfo.post_id) {
          data.disabled = true;
        }
        temp.push(data);
      });
      return temp;
    };
    const result = [{
      title: '根目录',
      postId: '',
    }];
    getChildren('').forEach((x: any) => {
      result.push(x);
    });
    return result;
  }

  private get content() {
    return decodeURIComponent(atob(this.postInfo.content));
  }

  private set content(value: string) {
    this.postInfo.content = btoa(encodeURIComponent(value));
  }

  private beforeMount() {
    const { postId } = this.$route.query;
    this.postInfo = ipcRenderer.sendSync('get_post_by_post_id', postId).data;
  }

  private navigationClick() {
    (this.$refs.mde as any).s_navigation = !(this.$refs.mde as any).s_navigation;
  }

  private fullScreenClick() {
    (this.$refs.mde as any).s_fullScreen = !(this.$refs.mde as any).s_fullScreen;
    this.$Notice.info({
      title: '按Esc退出全屏浏览',
      duration: 3,
    });
  }

  private edit() {
    this.$router.push({
      name: 'post_editor',
      query: {
        postId: this.postInfo.post_id,
      },
    });
  }

  private create() {
    this.$router.push({
      name: 'post_editor',
      query: {
        parentPostId: this.postInfo.post_id,
      },
    });
  }

  private move() {
    const selectedPost = (this.$refs.moveTree as any).getSelectedNodes()[0];
    const ret = ipcRenderer.sendSync('move_post', this.postInfo.post_id, selectedPost.postId);
    if (ret.status) {
      this.$Notice.success({
        title: '成功',
        desc: `成功移动到${selectedPost.title}下`,
      });
    } else {
      this.$Notice.error({
        title: '移动失败',
      });
    }
    this.$store.state.refresh();
  }

  private remove() {
    const ret = ipcRenderer.sendSync('delete_post', this.postInfo.post_id);
    if (ret.status) {
      this.$Notice.success({
        title: '删除成功',
        desc: `${this.postInfo.title}已放入回收站`,
      });
      this.$router.push({
        name: 'index',
      });
    } else {
      this.$Notice.error({
        title: '删除失败',
      });
    }
    this.$store.state.refresh();
  }

  private mounted() {
    this.postLists = ipcRenderer.sendSync('get_post_list').data;
    (JSON.parse(this.postInfo.images)).forEach((x: any) => {
      (this.$refs.mde as any).markdownIt.image_add(x.imageId, x.base64);
    });

    document.onkeyup = (e:KeyboardEvent) => {
      if (e.code === 'Escape') {
        (this.$refs.mde as any).s_fullScreen = false;
      }
    };
  }
}
</script>

<style lang="less" scoped>
/deep/ .v-left-item {
  padding: 10px;
}

.toolbar {
  margin-top: 20px;
}
</style>
