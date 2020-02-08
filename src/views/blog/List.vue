<template>
  <div>
    <h1>分类列表-{{categoryName}}</h1>
    <List item-layout='vertical'>
      <ListItem v-for='blog in blogs' :key='blog.blog_id'>
        <ListItemMeta>
          <template slot='title'>
            <h2>
              <router-link v-if='!isRecycle' :to="{
                name: 'blog_view',
                query: {
                  bid: blog.blog_id,
                },
              }">{{blog.title}}</router-link>
              <span v-else>{{blog.title}}</span>
            </h2>
          </template>
          <template slot='description'>
            {{ blog.summary }}
          </template>
        </ListItemMeta>
        <template slot="action">
          <li v-if='!isRecycle'>
            {{blog.parent_category_name}} >> {{blog.category_name}}
          </li>
          <li>
            关键词：
            <Button
              v-for='(keyword, index) in blog.keywords.split(",")'
              :key='keyword'
              class='tag'
              :type="['primary', 'success', 'error', 'warning'][index % 4]"
              size='small'
              @click='keywordClick(keyword)'>
              {{keyword}}
            </Button>
          </li>
          <li>
            <a class='tag' v-if='!isRecycle' href="#" @click='editorBlog(blog.blog_id)'>编辑</a>
            <a class='tag' v-else href="#" @click='recycleBlog(blog.blog_id)'>恢复</a>
            <a class='tag' href="#" @click='showDeleteModal(blog)'>删除</a>
          </li>
          <Divider />
        </template>
      </ListItem>
    </List>
      <Modal v-model="deleteModal" title="确认删除" @on-ok="deleteBlog">
      <p>确认要删除
        <strong style='color: red'>&nbsp;{{targetBlog.title}}&nbsp;</strong>
        这个文章吗？
      </p>
      <p v-if='!isRecycle'>PS: 删除后可以从回收站恢复</p>
      <p v-else>PS: 删除后<strong style='color: red'>无法恢复！请谨慎操作</strong></p>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const { ipcRenderer } = (window as any).require('electron');

@Component
export default class BlogList extends Vue {
  private blogs: Array<object> = [];

  private categoryName: string = '';

  private deleteModal: boolean = false;

  private targetBlog: any = {};

  private isRecycle: boolean = false;

  private refresh() {
    this.blogs = [];
    this.isRecycle = false;
    const { cid } = this.$route.query;
    if (cid.toString() === '-1') { // 全部
      this.blogs = ipcRenderer.sendSync('get_blogs');
      this.categoryName = '全部';
      return;
    }
    if (cid.toString() === '-2') { // 未分类
      this.blogs = ipcRenderer.sendSync('get_blogs');
      this.blogs = this.blogs.filter((x: any) => x.category_id === null || x.category_id === undefined || x.category_id === '');
      this.categoryName = '未分类';
      return;
    }
    if (cid.toString() === '-3') { // 回收站
      this.blogs = ipcRenderer.sendSync('get_deleted_blogs');
      this.categoryName = '回收站';
      this.isRecycle = true;
      return;
    }
    if (cid.toString() === '-4') { // 关键词
      this.blogs = ipcRenderer.sendSync('get_blogs_by_keyword', this.$route.query.keyword);
      this.categoryName = `关键词-${this.$route.query.keyword}`;
      return;
    }
    this.blogs = ipcRenderer.sendSync('get_blogs_by_cid', cid);
    this.categoryName = ipcRenderer.sendSync('get_category', cid).category_name;
  }

  private beforeMount() {
    this.refresh();
  }

  private editorBlog(blogId: string) {
    this.$router.push({
      name: 'manage_editor',
      query: {
        bid: blogId,
      },
    });
  }

  private showDeleteModal(blog: any) {
    this.deleteModal = true;
    this.targetBlog = blog;
  }

  private recycleBlog(blogId: string) {
    const ret = ipcRenderer.sendSync('recycle_blog', blogId);
    if (ret) {
      this.$Notice.success({
        title: '恢复成功',
        duration: 3,
      });
    }
    this.refresh();
  }

  private keywordClick(keyword: string) {
    (this.$router as any).push({
      name: 'blog_list',
      query: {
        cid: -4,
        keyword,
        hash: Math.ceil(Math.random() * 1000000),
      },
    });
  }

  private deleteBlog() {
    if (!this.isRecycle) {
      const ret = ipcRenderer.sendSync('delete_blog', this.targetBlog.blog_id);
      if (ret) {
        this.$Notice.success({
          title: '删除成功',
          duration: 3,
        });
      }
      this.refresh();
    } else {
      const ret = ipcRenderer.sendSync('drop_blog', this.targetBlog.blog_id);
      if (ret) {
        this.$Notice.success({
          title: '删除成功',
          duration: 3,
        });
      }
      this.refresh();
    }
  }
}
</script>

<style lang="less" scoped>
.tag {
  margin-right: 10px;
}
</style>
