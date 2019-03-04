/*
export const someFunction = ({commit, state, rootState}, payload) => {

}
*/

import { Connect } from 'uport-connect'

export const UPORT_LOGIN = async ({ commit }, network) => {
  try {
    const uport = new Connect('VuePort', {
      network
    })
    uport.loadState()
    if (uport.state && uport.did) {
      commit('UPORT_LOGIN', uport.state)
    } else {
      uport.requestDisclosure(
        {
          requested: ['name'],
          network: network,
          notifications: true
        },
        'disclosureReq'
      )
      const data = await uport.onResponse('disclosureReq')
      commit('UPORT_LOGIN', data.payload)
    }
  } catch (e) {
    throw Error(e.message)
  }
}

export const UPORT_LOGOUT = async ({ commit }) => {
  const uport = new Connect('VuePort')
  uport.logout()
  commit('UPORT_LOGOUT')
}

export const METAMASK_CONNECT = async ({ commit }) => {
  try {
    commit('METAMASK_CONNECT', await window.ethereum.enable())
  } catch (e) {
    throw Error(e.message)
  }
}
