<template>
  <ul class="message-item">
    <li v-for="(item, index) in content" :key="index" @click="switchGroup(index, item.id)"
      :class="['message-list', {'message-active': item.active}]">

      <div class="message-left">
        <el-badge class="item" :max="99"
          :value="item.newMessageCount" :hidden="!item.isNewMessage">
          <img class="message-avatar" :src="item.avatar">
        </el-badge>
      </div>

      <div class="message-right">
        <div class="message-header">
          <div class="message-title">{{item.name}}</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { gotoBottom } from '@/assets/tools'

export default {
  name: 'MessageGroup',
  props: { content: { type: Array } },
  data () {
    return {
      gotoBottom: gotoBottom
    }
  },
  methods: {
    /**
     * 切换联系对象
     */
    switchGroup (index, id) {
      this.content.map(item => {
        item.active = false
      })
      this.gotoBottom()
      this.content[index].active = true
      this.$forceUpdate()
      this.$emit('switchGroup', index, id)
    }
  }
}
</script>

<style lang="scss" scoped>
.message-active {
  background: rgba(255, 255, 255, .4);
}
.message-item {
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .message-list {
    display: flex;
    padding: 10px 15px;
    width: 100%;
    height: 62px;
    font-size: 12px;
    box-sizing: border-box;
    &:hover {
      background: rgba(255, 255, 255, .4);
    }
    .message-left {
      margin-right: 10px;
      font-size: 0;
      .message-avatar {
        width: 40px;
        height: 40px;
      }
      .message-group {
        border: 1px solid #dedede;
        box-sizing: border-box;
      }
    }
    .message-right {
      flex: 1;
      overflow: hidden;
      .message-header {
        display: flex;
        justify-content: space-between;
        .message-title {
          width: 100%;
          font-size: 14px;
        }
        .message-time {
          color: #aaaaaa;
        }
      }
      .message-content {
        margin-top: 4px;
        color: #999999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
