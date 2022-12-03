<template>
  <div class="message-panel-box">
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in messageTemplate()"
        :key="index"
        :class="judgeClass(item.type)">

        <img class="message-avatar"
          :src="item.avatar ? item.avatar : './static/avatar/avatar_14.jpg'"
          :alt="item.name ? item.name : '我是憨批'">

        <p class="message-nickname" v-if="item.type === 'server'">{{item.name}} {{item.message.time}}</p>
        <p class="message-nickname" v-else>{{item.message.time}} {{item.name}}</p>
        <p class="message-classic" v-html="item.message.content"></p>
      </li>
    </ul>
  </div>
</template>

<script>

import Bus from '@/assets/eventBus'
import { gotoBottom } from '@/assets/tools'

export default {
  name: 'MessagePanel',
  props: {
    // 选择的联系人ID
    nowSwitchId: { type: String },
    // 当前用户
    localInfo: { type: Object },
    // 当前联系人的聊天记录
    content: { type: Array }
  },
  data () {
    return {
      message: {},
      gotoBottom: gotoBottom
    }
  },
  mounted () {
    /**
     * 当前用户发的消息
     */
    Bus.$on('MESSAGE', response => {
      let gotoId = response.to
      let fromId = response.from

      this.initMessageArray(gotoId, fromId)
      this.message[gotoId].push(response)
      this.$forceUpdate()
      // 把消息传给父级
      this.$emit('message', response)
    })
  },
  methods: {
    /**
     * 数组初始化
     */
    initMessageArray (gotoId, fromId) {
      let array = this.message

      if (!gotoId) {
        return
      }
      if (!array[gotoId]) {
        this.message[gotoId] = []
      }

      if (!fromId) {
        return
      }
      if (!array[fromId]) {
        this.message[fromId] = []
      }
    },

    /**
     * 判断Class
     */
    judgeClass (type) {
      if (type === 'server') {
        return 'message-layout-left'
      } else {
        return 'message-layout-right'
      }
    },

    /**
     * 返回聊天记录集合
     */
    messageTemplate () {
      return this.message[this.nowSwitchId]
    }
  }
}
</script>

<style lang="scss">
.message-panel-box {
  padding: 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: rgba(255, 255, 255, .8);

  .eye-more {
    width: 100%;
    padding: 10px 0;
    font-size: 12px;
    text-align: center;
  }

  .message-styles-box {
    margin-bottom: 20px;
    .message-layout-left,
    .message-layout-right {
      margin-top: 20px;
      width: 100%;
      .message-classic::before {
        content: '';
        position: absolute;
        border-width: 8px;
        border-style: solid;
      }
    }

    .message-layout-left {
      .message-avatar {
        float: left;
        margin-right: 10px;
      }
      .message-classic {
        background-color: rgba(255, 255, 255, .8);
        &::before {
          left: -16px;
          border-color: transparent rgba(255, 255, 255, .8) transparent transparent;
        }
      }
    }

    .message-layout-right {
      text-align: right;
      .message-avatar {
        float: right;
        margin-left: 10px;
      }
      .message-classic {
        text-align: left;
        color: #ffffff;
        background-color: rgba(55, 126, 200, .8);
        &::before {
          right: -16px;
          border-color:  transparent transparent  transparent rgba(55, 126, 200, .8);
        }
      }
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }
    .message-nickname {
      color: #777777;
      font-size: 12px;
    }

    .message-classic {
      position: relative;
      max-width: 45%;
      margin-top: 5px;
      display: inline-block;
      padding: 9px 12px;
      font-size: 14px;
      color: #333333;
      border-radius: 5px;
      white-space: pre-line;
      word-break: break-all;
    }
  }
}
</style>
