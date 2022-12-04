<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="250px">
        <el-header height="40px">
          <i class="el-icon-user-solid icon-message"></i>
          <span class="title">联系人</span>
        </el-header>

        <message-group :content="content"
        @switchGroup="switchGroup"/>
      </el-aside>

      <el-main>
        <el-header height="40px">
          <span class="title" v-if="nowSwitchId === 'group'">聊天室 ({{content.length}}) 人</span>
          <span class="title" v-else>{{content[nowSwitchIndex].name}}</span>
        </el-header>

        <message-panel
          :content="content"
          :localInfo="localInfo"
          :nowSwitchId="nowSwitchId"
          @message="message"/>

        <message-input
          :content="content"
          :localInfo="localInfo"
          :nowSwitchId="nowSwitchId" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MessageGroup from '@/components/message-group'
import MessagePanel from '@/components/message-panel'
import MessageInput from '@/components/message-input'
import Bus from '@/assets/eventBus'
export default {
  name: 'Chat',
  components: { MessageGroup, MessagePanel, MessageInput },
  data () {
    return {
      content: [{
        id: 'group',
        name: '聊天室',
        avatar: './static/avatar/group.png',
        newMessageCount: 0,
        isNewMessage: false,
        active: true
      }],
      nowSwitchIndex: 0,
      nowSwitchId: 'group',
      localInfo: {}
    }
  },
  mounted () {
    const params = this.$route.params
    // 判断是否通过路由跳转过来的
    if (params.id) {
      this.localInfo = {
        id: params.id,
        avatar: params.avatar,
        name: params.name
      }
    } else {
      this.goBack()
    }
    // 发送初始化消息
    let o = {}
    o.type = 'chat_init_request'
    o.time = new Date().getTime().toString()
    if (this.$websocket.ws && this.$websocket.ws.readyState === 1) {
      this.$websocket.ws.send(JSON.stringify(o))
    }
    Bus.$on('initChat', body => {
      // 保存所有用户信息
      for (const i in body) {
        if (body[i].id === this.localInfo.id) {
          continue
        }
        let info = {
          id: body[i].id,
          active: false,
          name: body[i].name,
          avatar: body[i].avatar,
          newMessageCount: 0,
          isNewMessage: false
        }
        this.content.push(info)
      }
    })
    Bus.$on('changeUser', res => {
      // 添加联系人
      if (res.code === '1') {
        let info = {
          id: res.id,
          active: false,
          name: res.name,
          avatar: res.avatar,
          newMessageCount: 0,
          isNewMessage: false
        }
        this.content.push(info)
      } else {
        // 如果当前选择的人离开了就选中聊天室
        if (res.id === this.content[this.nowSwitch]) {
          this.content[0].active = true
          this.nowSwitch = 0
          this.content[0].message.newMessageCount = 0
          this.content[0].message.isNewMessage = false
        }
        // 删除联系人
        for (let i = 0; i < this.content.length; i++) {
          if (res.id === this.content[i].id) {
            this.content.splice(i, 1)
          }
        }
      }
    })
  },
  methods: {
    switchGroup (index, id) {
      // 传递给父级
      this.nowSwitchIndex = index
      this.nowSwitchId = id
      // 隐藏小红点
      if (this.content[index].isNewMessage !== undefined) {
        this.content[index].isNewMessage = false
        this.content[index].newMessageCount = 0
      }
    },
    message (res) {
      let fromId = res.from
      if (res.to === 'group') {
        fromId = 'group'
      }
      this.content.map(item => {
        if (item.id === fromId && this.nowSwitchId !== fromId) {
          item.newMessageCount += 1
          item.isNewMessage = true
        }
      })
      this.$forceUpdate()
    },
    goBack () {
      let href = window.location.href
      window.location.href = href.split('#')[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  background-image: url('/static/images/bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 88%;
    margin: 30px auto;
    .el-aside,
    .el-main {
      display: flex;
      flex-direction: column;
      border-radius: 6px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .el-aside {
      background: rgba(235, 233, 232, .8);
    }
    .el-main {
      padding: 0;
      margin-left: 20px;
    }
    .el-header {
      position: relative;
      line-height: 40px;
      background: rgb(55, 126, 200);
      overflow: hidden;
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
</style>
