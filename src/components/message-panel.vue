<template>
  <div class="message-panel-box">
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in messageTemplate()"
        :key="index"
        :class="judgeClass(item.server)">
        <img class="message-avatar" :src="item.avatar" :alt="item.name">
        <p class="message-nickname" v-if="item.server === 'server'">{{item.name}} {{transformationTime(item.time)}}</p>
        <p class="message-nickname" v-else>{{transformationTime(item.time)}} {{item.name}}</p>
        <p class="message-classic" v-html="item.content"></p>
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
    Bus.$on('handleMessage', response => {
      let fromId = response.from
      let gotoId = response.to
      this.initMessageArray(gotoId, fromId)
      if (response.server === 'server') {
        if (gotoId === 'group') {
          this.message['group'].push(response)
        } else {
          this.message[fromId].push(response)
        }
      } else {
        this.message[gotoId].push(response)
      }
      this.$forceUpdate()
      // 把消息传给父级
      if (response.server === 'server') {
        this.$emit('message', response)
      }
    })
  },
  methods: {
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
    judgeClass (type) {
      if (type === 'server') {
        return 'message-layout-left'
      } else {
        return 'message-layout-right'
      }
    },
    messageTemplate () {
      return this.message[this.nowSwitchId]
    },
    transformationTime (inputTime) {
      inputTime = inputTime.substr(0, 10)
      var date = new Date(inputTime * 1000)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + ' ' + h + ':' + minute + ':' + second
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
