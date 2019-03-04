import { treshold, listingsFor, purchases, getListing } from '@/util/marketplace'

export const PUBLISHER_TRESHOLD = async ({ commit }) => {
  try {
    commit('PUBLISHER_TRESHOLD', await treshold())
  } catch (e) {
    throw Error(e.message)
  }
}

export const USER_LISTINGS = async ({ commit, state, rootState }) => {
  try {
    commit('USER_LISTINGS', await listingsFor(rootState.auth.address))
  } catch (e) {
    throw Error(e.message)
  }
}

export const ALL_LISTINGS = async ({ commit }) => {
  try {
    commit('ALL_LISTINGS', await listingsFor())
  } catch (e) {
    throw Error(e.message)
  }
}

export const USER_PURCHASES = async ({ commit, state, rootState }) => {
  try {
    commit('USER_PURCHASES', await purchases(rootState.auth.address))
  } catch (e) {
    throw Error(e.message)
  }
}

export const UPDATE_LISTING = async ({ commit }, payload) => {
  commit('UPDATE_LISTING', await getListing(payload))
}