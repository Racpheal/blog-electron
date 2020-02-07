<template>
  <div>
    <h1>分类列表-{{categoryName}}</h1>
    <List item-layout='vertical'>
      <ListItem v-for='blog in blogs' :key='blog.blog_id'>
        <ListItemMeta>
          <template slot='title'>
            >>
            <router-link :to="{
              name: 'blog_view',
              query: {
                bid: blog.blog_id,
              },
            }">{{blog.title}}</router-link>
          </template>
          <template slot='description'>
            {{ blog.summary }}
          </template>
        </ListItemMeta>
        <template slot="action">
          <li>
            <a href='#'>{{blog.parent_category_name}}</a>
            >>
            <a href="#">{{blog.category_name}}</a>
          </li>
          <li>
            <a href="#" @click='editorBlog(blog.blog_id)'>编辑</a>
          </li>
          <li>
            <a href="#">删除</a>
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
  private blogs: Array<object> = [];

  private categoryName: string = '';

  private beforeMount() {
    this.blogs = [];
    const { cid } = this.$route.query;
    if (cid.toString() === '-1') { // 全部
      this.blogs = ipcRenderer.sendSync('get_blogs');
      this.categoryName = '全部';
      return;
    }
    this.blogs = ipcRenderer.sendSync('get_blogs_by_cid', cid);
    this.categoryName = ipcRenderer.sendSync('get_category', cid).category_name;
  }

  private editorBlog(blogId: string) {
    this.$router.push({
      name: 'manage_editor',
      query: {
        bid: blogId,
      },
    });
  }
}
</script>

<style lang="less" scoped>
</style>
