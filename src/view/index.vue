<template>
  <el-dialog
    title="Setting chat info"
    :visible.sync="dialogVisible"
    :before-close="closeWindow">

    <div class="avatar-box">
      <el-input
        placeholder="Your name"
        v-model="name"
        maxlength="8">
      </el-input>
      <img :src="avatar || './static/avatar/avatar_01.jpg'" @click="nextAvatar">
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="login">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { avatars } from '@/assets/data'
import { close } from '@/assets/tools'
export default {
  name: 'Index',
  data () {
    return {
      avatar: null,
      name: '',
      random: 0,
      dialogVisible: true,
      closeWindow: close
    }
  },
  mounted () {
    this.hashAvatar()
  },
  methods: {
    // 随机头像
    hashAvatar () {
      let length = avatars.length
      let random = Math.floor(Math.random() * length)
      this.random = random
      this.avatar = avatars[random]
    },
    // 下一张头像
    nextAvatar () {
      if (this.random === avatars.length) {
        this.random = 0
      }
      this.avatar = avatars[this.random += 1]
    },
    login () {
      let name = this.name
      let avatar = avatars[this.random]
      // 未输入名称时随机生成一个
      if (name.replace(/\s+/g, '') === '' || name === 'null') {
        this.name = name = `路人${Math.floor(Math.random() * 123 + Math.random() * 234)}`
      }

      // 发送登录消息
      let o = {}
      o.type = 'login_request'
      o.time = new Date()
      o.name = name
      o.avatar = avatar

      if (this.$websocket.ws && this.$websocket.ws.readyState === 1) {
        this.$websocket.ws.send(JSON.stringify(o))
        console.log('send', JSON.stringify(o))
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  .el-dialog {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 345px;
    height: 333px;
    margin: auto !important;
    .el-dialog__header {
      .el-dialog__headerbtn {
        top: 24px;
      }
    }
    .el-dialog__body {
      padding: 20px;
    }
  }

  .avatar-box {
    text-align: center;
    .el-input {
      .el-input__inner {
        padding: 0 12px;
        width: 120px;
        text-align: center;
      }
    }
    img {
      margin-top: 15px;
      cursor: pointer;
      width: 120px;
      height: 120px;
    }
  }

  .el-dialog__footer {
    padding-top: 0;
    .dialog-footer {
      display: block;
      text-align: center;
    }
  }
}

@media screen and (max-width: 767px) {
  #app {
    .el-container {
      width: 100%;
      margin: 0 auto;
      .el-aside {
        width: 70px !important;
        border-radius: 0;
        .el-header {
          padding: 0 0;
          text-align: center;
          .title {
            display: none;
          }
        }
        .message-item {
          .message-list {
            .message-right {
              display: none;
            }
            .message-left{
              margin-right: 0;
            }
          }
        }
      }
      .el-main {
        margin-left: 0;
        border-radius: 0;
        .message-panel-box {
          padding: 0 12px;
        }
        .message-styles-box {
          .message-classic {
            max-width: 70%;
          }
        }
      }
    }
    .el-dialog {
      width: 80%;
    }
  }
  .face-warp {
    width: 70%;
  }
}
.el-message-box {
  width: auto !important;
}
</style>
