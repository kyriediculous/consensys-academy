export const PUBLISHER_TRESHOLD = state => state.publisherTreshold

export const USER_LISTINGS = state => state.myListings

export const ALL_LISTINGS = state => state.listings

export const LISTING_DETAILS = state => id => state.listings.find(l => l.id === id)
