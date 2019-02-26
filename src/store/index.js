import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import network from './network'
import marketplace from './marketplace'
import staking from './staking'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    network,
    marketplace,
    staking
  }
})
