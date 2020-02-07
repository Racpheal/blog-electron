<template>
  <div>
    <h1>博客列表</h1>
    <Table border ref="table" :columns="columns" :data="data" size='small'>
      <template slot='title' slot-scope="{ row }">
        {{ row.title }}
      </template>
      <template slot='operation' slot-scope="{ row }">
        <a href='#' @click='editorBlog(row.bid)'>编辑</a>
        <a style='margin-left: 10px;' href='#' @click='deleteBlog(row.bid)'>删除</a>
      </template>
      <template slot='category' slot-scope="{ row }">
        <template v-for='index in [1, 2, 3]'>
          >
          <a href='#' :key='index'
            @click='listCategory(index, row[`category_id${index}`])'>
            {{ row[`category${index}`] }}
          </a>
        </template>
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ManageList extends Vue {
  private columns: Array<object> = [
    {
      type: 'selection',
      width: 60,
      align: 'center',
    },
    {
      title: 'ID',
      key: 'bid',
      width: 50,
    },
    {
      title: '标题',
      key: 'title',
      slot: 'title',
    },
    {
      title: '类别',
      key: 'category',
      slot: 'category',
      width: 300,
    },
    {
      title: '操作',
      key: 'operation',
      slot: 'operation',
      width: 200,
    },
  ];

  private data: Array<object> = [
    {
      bid: 1,
      title: '测试1',
      category1: 'category1',
      category_id1: 1,
      category2: 'category2',
      category_id2: 1,
      category3: 'category3',
      category_id3: 1,
    },
  ];

  private editorBlog(bid: Number) {
    console.log(bid, this);
  }

  private deleteBlog(bid: Number) {
    console.log(bid, this);
  }

  private listCategory(index: Number, cid: Number) {
    console.log(index, cid, this);
  }
}
</script>

<style lang="less" scoped>

</style>
