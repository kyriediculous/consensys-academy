export const PUBLISHER_TRESHOLD = (state, payload) => {
    console.log('PUBLISHER_TRESHOLD', payload)
    state.publisherTreshold = payload
}