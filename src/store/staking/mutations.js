export const STAKED = (state, payload) => {
  console.log("STAKED", payload)
  state.staked = payload
}

export const TOKEN = (state, payload) => {
  console.log("TOKEN", payload)
  state.token = payload
}
