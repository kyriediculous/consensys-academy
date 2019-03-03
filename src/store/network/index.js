export default {
  namespaced: true,
  state: {
    selected: { id: '4', rpcUrl: 'https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53' }
  },
  getters: {
    SELECTED: state => state.selected
  },
  mutations: {
    SELECT_NETWORK: (state, payload) => (state.selected = payload)
  }
}
