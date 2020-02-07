<template>
  <div>
    <h1>分类管理</h1>
    <Layout>
      <Row>
        <i-col span='8'>
          <Tree :data='categoriesTree'></Tree>
        </i-col>
        <i-col>
        </i-col>
      </Row>
    </Layout>
    <Modal v-model="categoryModal" @on-ok="changeCategory">
      <template slot='header'>
        <span v-if='addOrModify === 1'>添加新分类</span>
        <span v-else>修改分类</span>
      </template>
      <Form>
        <FormItem label='分类名称'>
          <Input v-model='targetCategory.category_name' />
        </FormItem>
        <FormItem v-if='modifyLevel === 2' label='分类所属父类'>
          <Select v-model="targetCategory.parent_category_id">
            <Option
              v-for='cate in categories.filter(x => x.category_level === 1)'
              :value='cate.category_id'
              :key='cate.category_id'>
                {{ cate.category_name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="deleteModal" title="确认删除" @on-ok="deleteCategory">
      <p>确认要删除
        <strong style='color: red'>&nbsp;{{targetCategory.category_name}}&nbsp;</strong>
        这个分类吗？
      </p>
      <p>PS：删除不会丢失文章.</p>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const { ipcRenderer } = (window as any).require('electron');

@Component
export default class ManageCategory extends Vue {
  private categoryModal: boolean = false;

  private deleteModal: boolean = false;

  private addOrModify: Number = 1;

  private modifyLevel: Number = 1;

  private targetCategory: any = {};

  private categories: Array<any> = [];

  private get categoriesTree() {
    const treeData: Array<any> = [
      {
        selected: false,
        disabled: true,
        render: (h: Function, args: any) => h('Button', {
          props: {
            icon: 'md-add',
          },
          on: {
            click: () => {
              this.showCategoryModal(1, 1, {
                category_level: 1,
                category_name: '',
              });
            },
          },
        }),
      },
    ];
    this.categories.filter((x: any) => x.category_level === 1).forEach((x: any) => {
      const children: any = [];
      const secondCate = this.categories.filter((y: any) => y.category_level === 2
        && y.parent_category_id === x.category_id).forEach((y: any) => {
        children.push({
          category_id: y.category_id,
          category_name: y.category_name,
          parent_category_id: y.parent_category_id,
          selected: false,
          disabled: true,
          render: (h: Function, args: any) => h('span', [
            h('span', {
              domProps: {
                innerHTML: args.data.category_name,
              },
              style: {
                width: '200px',
                display: 'inline-block',
              },
            }),
            h('Button', {
              props: {
                icon: 'md-trash',
              },
              style: {
                marginLeft: '10px',
              },
              on: {
                click: () => {
                  this.showDeleteModal(2, {
                    category_id: args.data.category_id,
                    category_name: args.data.category_name,
                  });
                },
              },
            }),
            h('Button', {
              props: {
                icon: 'md-create',
              },
              style: {
                marginLeft: '10px',
              },
              on: {
                click: () => {
                  this.showCategoryModal(2, 2, {
                    category_id: args.data.category_id,
                    category_name: args.data.category_name,
                    parent_category_id: args.data.parent_category_id,
                    category_level: args.data.category_level,
                  });
                },
              },
            }),
          ]),
        });
      });
      treeData.push({
        category_id: x.category_id,
        category_name: x.category_name,
        expand: true,
        selected: false,
        disabled: true,
        children,
        render: (h: Function, args: any) => h('span', [
          h('span', {
            domProps: {
              innerHTML: args.data.category_name,
            },
            style: {
              width: '176px',
              display: 'inline-block',
            },
          }),
          h('Button', {
            props: {
              icon: 'md-add',
            },
            style: {
              marginLeft: '10px',
            },
            on: {
              click: () => {
                this.showCategoryModal(1, 2, {
                  category_level: 2,
                  category_name: '',
                  parent_category_id: args.data.category_id,
                });
              },
            },
          }),
          h('Button', {
            props: {
              icon: 'md-trash',
            },
            style: {
              marginLeft: '10px',
            },
            on: {
              click: () => {
                this.showDeleteModal(1, {
                  category_id: args.data.category_id,
                  category_name: args.data.category_name,
                });
              },
            },
          }),
          h('Button', {
            props: {
              icon: 'md-create',
            },
            style: {
              marginLeft: '10px',
            },
            on: {
              click: () => {
                this.showCategoryModal(2, 1, {
                  category_id: args.data.category_id,
                  category_name: args.data.category_name,
                  category_level: 1,
                });
              },
            },
          }),
        ]),
      });
    });
    return treeData;
  }

  private showCategoryModal(addOrModify: Number, modifyLevel: Number, category: any) {
    this.categoryModal = true;
    this.addOrModify = addOrModify;
    this.modifyLevel = modifyLevel;
    this.targetCategory = category;
  }

  private showDeleteModal(modifyLevel: Number, category: any) {
    this.deleteModal = true;
    this.modifyLevel = modifyLevel;
    this.targetCategory = category;
  }

  private refresh() {
    this.categories = [];
    this.categories = ipcRenderer.sendSync('get_categories');
  }

  private beforeMount() {
    this.refresh();
  }

  private changeCategory() {
    let ret: boolean = false;
    if (this.modifyLevel === 1 && this.addOrModify === 1) { // 添加父类
      ret = ipcRenderer.sendSync('add_parent_category', {
        category_name: this.targetCategory.category_name,
      });
    } else if (this.modifyLevel === 1 && this.addOrModify === 2) { // 修改父类
      ret = ipcRenderer.sendSync('update_parent_category', {
        category_id: this.targetCategory.category_id,
        category_name: this.targetCategory.category_name,
      });
    } else if (this.modifyLevel === 2 && this.addOrModify === 1) { // 添加子类
      ret = ipcRenderer.sendSync('add_sub_category', {
        category_name: this.targetCategory.category_name,
        parent_category_id: this.targetCategory.parent_category_id,
      });
    } else if (this.modifyLevel === 2 && this.addOrModify === 2) { // 修改子类
      ret = ipcRenderer.sendSync('update_sub_category', {
        category_id: this.targetCategory.category_id,
        category_name: this.targetCategory.category_name,
        parent_category_id: this.targetCategory.parent_category_id,
      });
    }
    if (ret) {
      this.$Notice.success({
        title: '保存成功',
        duration: 3,
      });
    }
    this.refresh();
  }

  private deleteCategory() {
    const ret = ipcRenderer.sendSync('delete_category', {
      category_level: this.modifyLevel,
      category_id: this.targetCategory.category_id,
    });
    if (ret) {
      this.$Notice.success({
        title: '保存成功',
        duration: 3,
      });
    }
    this.refresh();
  }
}
</script>

<style lang="less" scoped>
</style>
