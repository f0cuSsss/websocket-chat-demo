
export const actions = {

 }
 
 export const mutations = {
     SOCKET_server_callback(state, message) {
         state.notification = message;
     }
 }
 
 export const state = () => ({
     notification: null
 })
 
 export const getters = {
     getNotification: ({ notification }) => notification
 }