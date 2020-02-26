<template>
  <div>
    <List item-layout='vertical'>
      <ListItem v-for='post in posts' :key='post.post_id'>
        <ListItemMeta :title="post.title" :description="getSummary(post.summary)" />
        <template slot="action">
          <li>
            <a href="#" @click='recyclePost(post)'>恢复</a>
          </li>
          <li>
            <a href="#" @click='dropPost(post)'>彻底删除</a>
          </li>
        </template>
      </ListItem>
    </List>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const { ipcRenderer } = (window as any).require('electron');

@Component
export default class BlogList extends Vue {
  private posts: Array<any> = [];

  private beforeMount() {
    this.reflash();
  }

  private reflash() {
    this.posts = [];
    this.posts = ipcRenderer.sendSync('get_deleted_posts').data;
    this.$store.state.refresh();
  }

  private getSummary(summary: string) {
    return decodeURIComponent(atob(summary));
  }

  private recyclePost(postInfo: any) {
    const ret = ipcRenderer.sendSync('recycle_post', postInfo.post_id);
    if (ret.status) {
      this.$Notice.success({
        title: '恢复成功',
        desc: `${postInfo.title}已恢复到主目录下`,
      });
      this.reflash();
    } else {
      this.$Notice.success({
        title: '恢复失败',
      });
    }
  }

  private dropPost(postInfo: any) {
    this.$Modal.confirm({
      title: '彻底删除确认',
      content: `确定要彻底删除${postInfo.title}吗？彻底删除将无法恢复！`,
      onOk: () => {
        const ret = ipcRenderer.sendSync('drop_post', postInfo.post_id);
        if (ret.status) {
          this.$Notice.success({
            title: '删除成功',
            desc: `${postInfo.title}已彻底删除`,
          });
          this.reflash();
        } else {
          this.$Notice.success({
            title: '删除失败',
          });
        }
      },
    });
  }
}
</script>

<style lang="less" scoped>
.tag {
  margin-right: 10px;
}
</style>
