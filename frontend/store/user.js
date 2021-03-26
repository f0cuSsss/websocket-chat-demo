export const actions = {
    
}

export const mutations = {
    SOCKET_setUser(state, user) {
        state.user = user;
    }
}

export const state = () => ({
    user: null
})

export const getters = {
    getMineData: ({ user }) => user
}