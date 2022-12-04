<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Bus from '@/assets/eventBus'
export default {
  name: 'App',
  methods: {
    // app.vue
    localSocket () {
      let that = this
      if ('WebSocket' in window) {
        console.log('您的浏览器支持 WebSocket!')
        that.ws = new WebSocket(`ws://101.43.140.129:12345/chat`)
        that.$websocket.setWs(that.ws)

        that.ws.onopen = function () {
          console.log('连接...')
        }

        that.ws.onmessage = function (res) {
          let data = JSON.parse(res.data)
          console.log('data', data)
          if (data.type === 'login_response') {
            that.$router.push({
              name: 'Chat',
              params: {
                id: data.id,
                avatar: data.avatar,
                name: data.name
              }
            })
          }
          if (data.type === 'chat_init_response') {
            Bus.$emit('initChat', data.data)
          } else if (data.type === 'user_change_response') {
            Bus.$emit('changeUser', data)
          } else if (data.type === 'chat_response') {
            Bus.$emit('handleMessage', data)
          }
        }
        that.ws.onclose = function () {
          // 关闭 websocket
          console.log('连接已关闭...')
          setTimeout(() => {
            that.localSocket()
          }, 2000)
        }
      } else {
        // 浏览器不支持 WebSocket
        console.log('您的浏览器不支持 WebSocket!')
      }
    }
  },
  created () {
    this.localSocket()
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

ul,ol {
  list-style: none;
}

.el-notification__content {
  margin-top: 20px;
  p {
    display: flex;
  }
  .notify-image {
    margin-right: 10px;
    width: 50px;
    height: 50px;
  }
  .notify-content {
    .notify-title {
      display: block;
      margin-bottom: 2px;
    }
  }
}

::-webkit-scrollbar {
  width: 8px;
  padding-right: 4px;
  background-color:#f8f8f8;
}
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 4px;
  border-radius: 4px;
  background-color: #c6c6c6;
}
::-webkit-scrollbar-thumb:window-inactive {
  background-color: #f8f8f8;
}
</style>
