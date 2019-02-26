import { treshold } from '@/util/marketplace'

export const PUBLISHER_TRESHOLD = async ({commit}) => {
    try {
        commit('PUBLISHER_TRESHOLD', await treshold() )
    } catch (e) {
        throw Error(e.message)
    }
}