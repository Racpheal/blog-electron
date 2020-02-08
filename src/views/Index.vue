<template>
  <div>
    <Layout>
      <Sider hide-trigger>
        <Menu theme="dark" width="auto" class='menu'>
          <Submenu name="blog">
            <template slot="title">
              <Icon type="ios-paper" @click='refresh' />
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
            <MenuItem
              name='no_catgory'
              :to='{
                name: "blog_list",
                query: {
                  cid: -2,
                  hash: Math.ceil(Math.random()*1000000)
                }
              }'>未分类
            </MenuItem>
            <MenuItem
              name='recycle'
              :to='{
                name: "blog_list",
                query: {
                  cid: -3,
                  hash: Math.ceil(Math.random()*1000000)
                }
              }'>回收站
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
                }'>
                {{ cate2.category_name }}
                <Badge :count="cate2.count" type='info'></Badge>
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
          <div class='tagPanel'>
            <h4 style='color: white; margin-left: 10px;'>关键词</h4>
            <Button
              v-for='(keyword, index) in keywords'
              :key='keyword'
              class='tag'
              :type="['primary', 'success', 'error', 'warning'][index % 4]"
              size='small'
              @click='keywordClick(keyword)'>
              {{keyword}}
            </Button>
          </div>
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

  private keywords: Array<string> = [];

  private refresh() {
    this.categories = ipcRenderer.sendSync('get_categories');
    this.keywords = ipcRenderer.sendSync('get_keywords');
    console.log(this.categories);
  }

  private beforeMount() {
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
  height: 100vh;
}

.menu {
  position: fixed;
  width: 240px !important;
}

.ivu-badge {
  float: right;
}

.tagPanel {
  padding: 15px;
}

.tag {
  margin:5px;
}
</style>
