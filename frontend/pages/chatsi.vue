<template>
  <div class="container">
    <p class="main-title">Chat</p>

    <div class="signin-block" v-if="!currentUser">
      <input 
        class="username-input"
        v-model="inputUsername" 
        placeholder="Your username"
        @keydown.enter="signin"
      >
      <button 
        class="signin-button"
        @click="signin"
      >Sign in</button>
    </div>


    <template v-else>
      <div class="logininfo">You logged in as <b>{{currentUser.name}}</b></div>

      <div class="message-list-block">
        <!-- <h3>Chat</h3> -->
        <ul class="message-list">
          <li
            class="message-item" 
            :class="{ 
              'message-info': item.type === 'info', 
              'message-item--mine': item.sender === currentUser.name 
            }"
            v-for="(item, i) in getMessages" 
            :key="item+i"
          >
            <template v-if="item.type === 'info'">
              <div :style="{ display: 'flex', 'justify-content': 'center' }">
                <h5 
                :style="{ 'margin-bottom': '3px', display: 'inline' }" 
                >[{{ item.sender }}]</h5>
                <span>&nbsp;{{ item.message }}</span>
              </div>
            </template>
            <template v-else>
              <h5 
                :style="{ 'margin-bottom': '3px' }" 
              >{{ item.sender === currentUser.name ? 'Me' : item.sender }}</h5>
              <p>{{ item.message }}</p>
            </template>
          </li>
        </ul>

        <div class="action-block">
          <input 
            @keydown.enter="handleSendMessage"
            @change="handleTyping"
            class="input-message" 
            v-model="inputMessage" 
            placeholder="Write a message..."
          >
          <button @click="handleSendMessage" class="send-message">Send</button>
        </div>

      </div>
    </template>
    <notifications group="fc-notifs" position="bottom right" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  sockets: {
    connect() {
      console.log('socket connected')
    },
    someone_typing_message(data) {
      console.log("Typing... ", data);
    }
  },
  data() {
    return {
      inputUsername: '',
      inputMessage: '',
    }
  },
  methods: {
    ...mapActions({
      pushNewMessage: 'message/pushNewMessage',

    }),
    signin() {
      if(this.inputUsername === '') return;

      this.$socket.emit('user_logged', 
        {
          name: this.inputUsername
        }
      );
    },
    handleSendMessage() {
      if(this.inputMessage === '') return;

      const message = {
        type: 'default',
        sender: this.currentUser.name,
        message: this.inputMessage
      }

      this.$socket.emit('createdMessage', message);
      this.pushNewMessage(message);
      this.inputMessage = '';
    },
    handleTyping() {
      if(this.inputMessage === '') return;
      this.$socket.emit('typing_message', this.currentUser.name);
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getMineData',
      getNotification: 'notification/getNotification',
      getMessages: 'message/getMessages'
    })
  },
  watch: {
    getNotification(value) {
      this.$notify({
        type: value.type,
        group: 'fc-notifs',
        text: value.message,
        duration: 1500
      });
    },
    getMessages() {
      
    }
  }
}
</script>

<style scope>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
}

.logininfo {
  margin: 25px 0 5px;
}

.message-info {
  /* background-color: rgb(207, 187, 0); */
  /* border-radius: 10px; */
  color: rgb(173, 156, 0);
  background-color: rgba(255, 255, 255, 0) !important;
  border: none !important;
  text-align: center;
  font-size: 14px;
  padding: 2px;
}

.main-title {
  border-bottom: 1px solid rgb(185, 185, 185);
  
  background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
  color: rgb(238, 255, 224);
  text-shadow: 1px 1px 2px black, 0 0 1em rgb(244, 255, 219);;
  font-size: 70px;
  font-weight: medium;
  padding: 30px;
  letter-spacing: 10px;
  justify-self: flex-end;
  width: 100vw;
  text-align: center;
}

.message-list-block {
  /* margin: 30px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70vh;
}

.message-list {
  background-color: rgba(235, 235, 235, 0.74);
  box-shadow: 0 0 3px 0px #989898;
  border-radius: 5px;
  padding: 20px;
  width: 40vw;
  /* text-align: start; */
  height: 100%;
  list-style: none;
  overflow-y: auto;
}

.message-item {
  background-color: rgb(250, 255, 241);
  border-bottom: 1px solid rgb(160, 160, 160);
  border-radius: 15px;
  padding: 10px 20px;
  margin: 5px;
  text-align: left;
}

.message-item p {
  margin: 0 3px;
}


.message-item--mine {
  background-color: rgba(221, 247, 255, 0.829);
  text-align: right;
}


.action-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px;
}

.input-message {
  background-color: rgba(233, 233, 233, 0.685);
  border-radius: 4px;
  border: none;
  border-bottom: 1px solid rgb(117, 117, 117);
  padding: 10px;
  width: 100%;
}

.input-message:focus {
  background-color: rgba(179, 179, 179, 0.74);
  outline: none;
  border-bottom: 2px solid green;
}

.send-message {
  height: 30px;
  border: none;
  background-color: rgb(8, 165, 8);
  cursor: pointer;
  border-radius: 5px;
  color: white;
  height: 100%;
  padding: 0 20px;
  margin-left: 5px;
  outline: none;
  transition: all 0.1s ease-in-out;
}

.send-message:hover {
  filter: brightness(0.9);
  transition: all 0.1s ease-in-out;
}


.signin-block {
  display: flex;
  flex-wrap: wrap;
  margin-top: 300px;
}

.username-input {
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 24px;
  padding: 7px;

}

.signin-button {
  background-color: rgb(118, 223, 48);
  border: none;
  border-radius: 10px;
  color: #000;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 8px;
  margin-left: 5px;
}

@media screen and (max-width: 700px) {
  .container {
    width: 100vw;
  }

  .message-list {
    width: 95vw;
  }

  .action-block {
    width: 95vw;
  }

  .main-title {
    padding: 0;
  }

  .message-list-block {
    height: 83vh;
  }

  .signin-block {
    justify-content: center;
  }

  .signin-button {
    width: 80%;
    margin-top: 10px;
  }
}

</style>
