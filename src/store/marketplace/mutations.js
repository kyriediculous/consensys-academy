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
  console.log(payload)
  state.myPurchases = payload
}