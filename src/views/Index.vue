<template>
  <div>
    <Layout>
      <Sider hide-trigger>
        <div class='logo' style='height:60px;width:100%;background-color:#225081;padding: 10px;'>
          <h1 style='color: white;margin-left: 20px;'>Wiki</h1>
        </div>
        <Content class='sider-content'>
          <p>页面树结构</p>
          <Tree :data='treeData' :render='treeRender'></Tree>
          <Divider />
          <p>分类</p>
          <router-link :to="{
            name: 'post_list',
            query: {
              type: 'recycle',
              hash: Math.ceil(Math.random() * 1000000),
            },
          }">回收站</router-link>
        </Content>
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
  private postLists: Array<object> = [];
  private keywords: Array<string> = [];
  private treeRender = (h: Function, args: any) => h('router-link', {
    props: {
      to: {
        name: 'post_view',
        query: {
          postId: args.data.postId,
          hash: Math.ceil(Math.random() * 1000000),
        },
      },
    },
    domProps: {
      innerHTML: args.data.title,
    },
  });

  private get treeData(): Array<any> {
    const getChildren = (postId: string|null): Array<any> => {
      const temp: Array<any> = [];
      const nodes = this.postLists.filter((x: any) => x.parent_post_id === postId);
      nodes.forEach((x: any) => {
        const data = {
          title: x.title,
          postId: x.post_id,
          expand: false,
          parentPostId: x.parent_post_id,
          children: getChildren(x.post_id),
        };
        temp.push(data);
      });
      return temp;
    };

    const result = [{
      title: '创建新页面',
      expand: false,
      render: (h: Function, args: any) => h('router-link', {
        props: {
          to: {
            name: 'post_editor',
            query: {
              postId: '',
              parentPostId: '',
              hash: Math.ceil(Math.random() * 1000000),
            },
          },
        },
        domProps: {
          innerHTML: args.data.title,
        },
      }),
    }];
    getChildren('').forEach((x: any) => {
      result.push(x);
    });
    return result;
  }

  private refresh() {
    this.postLists = ipcRenderer.sendSync('get_post_list').data;
  }

  private beforeMount() {
    this.refresh();
    this.$store.commit('setRefresh', this.refresh);
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
  background-color: #F5F5F5;
  border-right: 1px lightgray solid;
}

.sider-content {
  padding-left: 20px;
  padding-top: 20px;
}

.ivu-tree {
  // color: #225081;
  // /deep/ .ivu-tree-title {
  //   color: #225081;
  // }

  /deep/ .ivu-tree-title-selected {
    background-color: unset;
    color: lightseagreen;
    font-weight: bold;
  }

  /deep/ .ivu-tree-title:hover {
    background-color: unset;
    color: lightgreen;
  }

  /deep/ .logo {
    width: 100%;
    height: 50px;
    background-color: black;
  }
}
</style>
