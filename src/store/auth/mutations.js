
/*
export const someFunction = (state, payload) => {

}
*/

/*
     When accessing properties or array elements
     use Vue.set() to make sure the new property/element is also reactive
     if you are unsure, it is best to use Vue.set and Vue.delete() as a best practice
     */

export const UPORT_LOGIN = (state, payload) => {
  state.address = payload.did.split(':')[2]
  state.credentials = payload
  state.loggedIn = true
}

export const UPORT_LOGOUT = state => {
  state.credentials = undefined
}

export const METAMASK_CONNECT = (state, payload) => {
  state.credentials = {}
  state.address = payload[0]
  state.loggedIn = true
}

export const AUTH_TYPE = (state, payload) => {
  state.type = payload
}
