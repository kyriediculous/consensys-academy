import { staked, token } from '@/util/staking'
import { info } from '@/util/token'
export const STAKED = async ({ commit, state, rootState }) => {
  try {
    commit('STAKED', await staked(rootState.auth.address))
  } catch (e) {
    throw Error(e.message)
  }
}

export const TOKEN = async ({ commit }) => {
  try {
    const address = await token()
    commit('TOKEN', { address: address, ...(await info(address)) })
  } catch (e) {
    throw Error(e.message)
  }
}
