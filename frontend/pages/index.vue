<template>
  <div class="container">
    <h1>Test websocket</h1>

    <template v-if="!user">
      <input v-model="username" placeholder="Your username">
      <button @click="signin">Sign in</button>
    </template>
    <template v-else>
      <div>You logged in as <b>{{ user.user }}</b></div>

      <div class="message-list-block">
        <h3>Chat</h3>
        <ul class="message-list">
          <li 
            v-for="(msg, i) in messages" 
            :key="msg+i"
          >
            {{ msg }}
          </li>
        </ul>
        
        <div class="action-block">
          <input 
            @keydown.enter="handleSendMessage" 
            class="input-message" 
            v-model="inputMessage" 
            placeholder="Write a message..."
          >
          <button @click="handleSendMessage" class="send-message">Send</button>
        </div>

      </div>
    </template>
    <notifications group="feedback" position="bottom right" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      user: null,
      username: '',
      messages: [],
      inputMessage: '',
      ws: null
    }
  },
  methods: {
    sendMessage: (connection, event, payload) => 
        connection.send(JSON.stringify({ event, payload })
    ),
    handleSendMessage() {
      if(this.inputMessage === '') 
        return;

      this.sendMessage(this.ws, 'messanger', { reciver: this.username, message: this.inputMessage } );
      this.inputMessage = '';
    },
    signin() {
      if(this.username === '') return;

      this.ws = new WebSocket('ws://localhost:8899');

      this.ws.addEventListener('open', () => {
        this.sendMessage(this.ws, 'auth', { username: this.username, time: Date.now() })
      });

      this.ws.addEventListener('message', ({ data }) => {
        const res = JSON.parse(data);

        if(!res) return;

        switch(res.event) {
          case "auth": 
          {
            this.user = res.response;
            break;
          }
          case "messanger": 
          {
            if(!res) return;
            this.messages.push(`[${res.response.reciver}] ${res.response.message}`);
            break;
          }
          case "feedback": {
            this.$notify({
              type: 'success',
              group: 'feedback',
              text: res.response.messageSentMsg
            });
          }
          default: 
          {
            console.log("Undefined server response");
          }
        }
      });

    }
  },
  watch: {
    messages: (val) => {
      
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
h1 {
  font-size: 70px;
  margin: 100px 0 280px;
  letter-spacing: 10px;
  justify-self: flex-end;
}

input {
  margin: 20px;
}

.message-list-block {
  margin: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message-list {
  background-color: rgba(235, 235, 235, 0.74);
  border-radius: 5px;
  padding: 20px;
  width: 40vw;
  /* text-align: start; */
  list-style: none;
}

.message-list li {
  border-bottom: 1px solid rgb(160, 160, 160);
  padding: 10px 20px;
  margin: 5px;
  text-align: start;
}

.action-block {
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-message {
  background-color: rgba(223, 223, 223, 0.884);
  border-radius: 4px;
  border: none;
  border-bottom: 1px solid rgb(117, 117, 117);
  padding: 10px;
}

.send-message {
  height: 30px;
  border: none;
  background-color: rgb(8, 165, 8);
  border-radius: 5px;
  color: white;
}

</style>
