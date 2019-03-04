import Vue from 'vue' 

export const PUBLISHER_TRESHOLD = (state, payload) => {
  state.publisherTreshold = payload
}

export const USER_LISTINGS = (state, payload) => {
  state.myListings = payload
}

export const ALL_LISTINGS = (state, payload) => {
  state.listings = payload
}

export const USER_PURCHASES = (state, payload) => {
  state.myPurchases = payload
}

export const UPDATE_LISTING = (state, payload) => {
  let index = state.listings.findIndex(listing => listing.id === payload.id)
  Vue.set(state.listings, index, payload)
  index = state.myListings.findIndex(listing => listing.id === payload.id) 
  Vue.set(state.myListings, index, payload)
}