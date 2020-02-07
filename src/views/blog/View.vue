<template>
  <div>
    <h1>{{ blog.title }}</h1>
    <Breadcrumb style='margin-top: 10px;'>
      <BreadcrumbItem to="/">{{ blog.parent_category_name }}</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">{{ blog.category_name }}</BreadcrumbItem>
      <BreadcrumbItem>{{ blog.title }}</BreadcrumbItem>
    </Breadcrumb>
    <mavon-editor
      style="margin-top: 20px; height: 85vh"
      :toolbars='{
        navigation: true,
        readmodel: true,
      }'
      :navigation='true'
      defaultOpen='preview'
      :editable='false'
      :subfield='false'
      :boxShadow='false'
      :transition='false'
      ref='mde'
      v-model="blog.content"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

const { ipcRenderer } = (window as any).require('electron');

@Component
export default class ManageEditor extends Vue {
  private blog:any = {};

  private beforeMount() {
    const blogId = this.$route.query.bid;
    this.blog = ipcRenderer.sendSync('get_blog', blogId);
  }

  private mounted() {
    (JSON.parse(this.blog.images)).forEach((x: any) => {
      (this.$refs.mde as any).markdownIt.image_add(x.imageId, x.base64);
    });
  }
}
</script>

<style lang="less" scoped>
</style>
