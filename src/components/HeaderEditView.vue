<template>
  <div>
    <Input v-if='isEdit' @on-enter='inputEnter' v-model='pContent' show-word-limit maxlength="50"/>
    <h1 v-if='!isEdit' @click='onHeaderClick'>{{ pContent }}</h1>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Model, Emit, Prop,
} from 'vue-property-decorator';

@Component
export default class HeaderEditView extends Vue {
  private isEdit: boolean = true;

  @Prop() private content!: string;

  private pContent: string = this.content;

  private beforeMount() {
    this.isEdit = this.content.length === 0;
  }

  private onHeaderClick() {
    this.isEdit = true;
  }

  @Emit('on-enter')
  private inputEnter() :string {
    if (this.pContent.length !== 0) {
      this.isEdit = false;
      return this.pContent;
    }
    return '';
  }
}
</script>

<style lang="less" scoped>

</style>
