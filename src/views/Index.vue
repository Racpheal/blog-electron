<template>
  <div>
    <Layout>
      <Sider hide-trigger>
        <Menu theme="dark"  width="auto" style='height: 100vh'>
          <Submenu name="blog">
            <template slot="title">
              <Icon type="ios-paper" />
              我的博客
            </template>
            <MenuItem
                name='all'
                :to='{
                  name: "blog_list",
                  query: {
                    cid: -1,
                    hash: Math.ceil(Math.random()*1000000)
                  }
                }'>全部
              </MenuItem>
            <Submenu
              v-for='cate in categories.filter(x => x.category_level === 1)'
              :name="cate.category_id"
              :key="cate.category_id">
              <template slot="title">
                {{ cate.category_name }}
              </template>
              <MenuItem
                v-for='cate2 in categories.filter(x => x.parent_category_id === cate.category_id)'
                :name='cate2.category_id'
                :key='cate2.category_id'
                :to='{
                  name: "blog_list",
                  query: {
                    cid: cate2.category_id,
                    hash: Math.ceil(Math.random()*1000000)
                  }
                }'>{{ cate2.category_name }}
              </MenuItem>
            </Submenu>
          </Submenu>
          <Submenu name="manage">
            <template slot="title">
              <Icon type="ios-paper" />
              博客管理
            </template>
            <MenuItem name="editor" :to='{
              name: "manage_editor",
              query: {
                hash: Math.ceil(Math.random()*1000000)
              }
            }'>添加博客</MenuItem>
            <!-- <MenuItem name="list" to='/manage/list'>我的博客</MenuItem> -->
            <MenuItem name="category" to='/manage/category'>分类管理</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Content>
        <router-view :key="$route.path + $route.query.hash"/>
      </Content>
    </Layout>
  </div>
</template>

<script lang='ts'>

import { Component, Vue } from 'vue-property-decorator';

const { ipcRenderer } = (window as any).require('electron');

@Component
export default class Index extends Vue {
  private categories: Array<object> = [];

  constructor() {
    super();
    this.categories = ipcRenderer.sendSync('get_categories');
  }
}
</script>

<style lang="less" scoped>

.ivu-layout-content {
  padding: 10px;
}

.ivu-layout-sider {
  width: 240px !important;
  min-width: 240px !important;
  max-width: 240px !important;
}
</style>
