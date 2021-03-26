export const actions = {
   SOCKET_fetchMessages({ commit }) {
    console.log("socket_fetchMessages --- action");
   },
   pushNewMessage({ commit }, message) {
       commit('SOCKET_addMessage', message);
   }
}

export const mutations = {
    SOCKET_addMessage(state, message) {
        state.messages.push(message);
    },
    SOCKET_setMessages(state, messages) {
        state.messages = messages;
    }
}

export const state = () => ({
    messages: [],
})

export const getters = {
    getMessages: ({ messages }) => messages
}