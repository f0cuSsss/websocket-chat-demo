export const actions = {
    initConnection({ commit }) {
        commit('setSocketConnection', { test: "OK" });
    }
}

export const mutations = {
    setSocketConnection: (state, connection) => {
        state.socket_connection = connection;
    }
}

export const state = () => ({
    socket_connection: null,

})

export const getters = {
    getSocketConnection: ({ socket_connection }) => socket_connection
}