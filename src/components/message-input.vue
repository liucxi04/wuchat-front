<template>
  <div class="message-input-box">

    <el-input
      type="textarea" resize="none"
      :autosize="{ minRows: 3, maxRows: 3}"
      v-model="textArea" v-on:keyup.native="keyUp">
    </el-input>

    <div class="footer-tools">
      <el-button size="mini" type="primary" @click="sendMessage" class="send-button">
        发送
      </el-button>
    </div>
  </div>
</template>

<script>

import Bus from '@/assets/eventBus'
import { gotoBottom } from '@/assets/tools'

export default {
  name: 'MessageInput',
  data () {
    return {
      textArea: '',
      gotoBottom: gotoBottom
    }
  },
  props: {
    // 联系人列表
    content: { type: Array },
    // 当前选择的ID
    nowSwitchId: { type: String },
    // 当前用户
    localInfo: { type: Object }
  },
  methods: {
    /**
     * 消息类型
     */
    nowSwitchType () {
      if (this.nowSwitchId === 'group') {
        return 'group_chat_request'
      } else {
        return 'single_chat_request'
      }
    },

    /**
     * 消息过滤
     */
    textAreaTran () {
      return this.textArea.replace(/\n/g, '').replace(new RegExp('<', 'gm'), '&lt')
    },

    /**
     * 检测空白
     */
    blankTesting () {
      if (this.textArea.replace(/\s+/g, '') === '') {
        this.$alert('不能发送空白消息', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      return true
    },

    /**
     * 按Enter发送消息
     */
    keyUp (event) {
      if (event.key === 'Enter') {
        this.sendMessage()
      }
    },

    /**
     * 发送消息
     */
    sendMessage () {
      let message = {
        // 消息类型
        type: this.nowSwitchType(),
        // 收者ID
        to: this.nowSwitchId,
        // 发送者ID
        from: this.localInfo.id,
        message: {
          // 发送时间
          time: new Date(),
          // 聊天内容
          content: this.textAreaTran()
        }
      }
      if (this.blankTesting()) {
        // 发送服务器
        if (this.$websocket.ws && this.$websocket.ws.readyState === 1) {
          this.$websocket.ws.send(JSON.stringify(message))
          console.log('send', JSON.stringify(message))
        }
        // 传递至同级
        Bus.$emit('MESSAGE', message)
        // 消息清空
        this.textArea = ''
        // 消息置底
        this.gotoBottom()
      }
    }
  }
}
</script>

<style lang="scss">
.message-input-box {
  height: 150px;
  background-color: rgba(255, 255, 255, .85);
  border-top: 1px solid #dddddd;
  .input-tools {
    position: relative;
    padding-left: 10px;
    padding-top: 10px;
    .upload-demo {
      display: inline;
    }
    i {
      margin-left: 10px;
      color: rgb(94, 94, 94);
      font-size: 20px;
      cursor: pointer;
    }
  }
  .el-textarea {
    .el-textarea__inner {
      padding: 5px 20px;
      border-radius: 0;
      border: 0;
      background-color: transparent;
    }
  }
  .footer-tools {
    text-align: right;
    .send-button {
      padding: 7px 10px;
      margin-right: 20px;
      background: #377ec8;
    }
  }
}
.face-panel {
  .face {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
</style>
