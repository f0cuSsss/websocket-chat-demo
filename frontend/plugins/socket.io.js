// import Vue from 'vue';
// import VueSocketIOExt from 'vue-socket.io-extended';
// import { io } from 'socket.io-client';

// const socket = io('ws://localhost');
// // , {
// //     withCredentials: true,
// //     extraHeaders: {
// //       "test-header": "test-header daata"
// //     }
// //   }

// export default ({ store }) => {
//     Vue.use(VueSocketIOExt, socket, { store });
// }


import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
 
export default ({ store }) => {
    Vue.use(new VueSocketIO({
        debug: false,
        connection: process.env.BASE_URL || 'http://localhost:3050',
        vuex: {
            store,
            actionPrefix: 'SOCKET_',
            mutationPrefix: 'SOCKET_'
        }
    }))
}