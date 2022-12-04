<template>
  <div class="message-input-box">

    <el-input type="textarea" resize="none"
      :autosize="{ minRows: 3, maxRows: 3}" v-model="textArea">
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
    // 当前联系人
    nowSwitchId: { type: String },
    // 当前用户
    localInfo: { type: Object }
  },
  methods: {
    /**
     * 发送消息
     */
    sendMessage () {
      let message = {
        // 消息类型
        type: 'chat_request',
        // 服务端消息还是客户端消息
        server: 'client',
        // 发送时间
        time: new Date().getTime().toString(),
        // 发送者ID
        from: this.localInfo.id,
        name: this.localInfo.name,
        avatar: this.localInfo.avatar,
        // 收者ID
        to: this.nowSwitchId,
        // 聊天内容
        content: this.textArea
      }
      // 发送服务器
      if (this.$websocket.ws && this.$websocket.ws.readyState === 1) {
        this.$websocket.ws.send(JSON.stringify(message))
        console.log('send', JSON.stringify(message))
      }
      // 传递至同级
      Bus.$emit('handleMessage', message)
      // 消息清空
      this.textArea = ''
      // 消息置底
      this.gotoBottom()
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
