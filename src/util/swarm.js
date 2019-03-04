import { SwarmClient } from '@erebos/swarm'

export default new SwarmClient({
  http: process.env.VUE_APP_SWARM
})
