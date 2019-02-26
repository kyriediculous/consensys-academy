import Marketplace from '../../build/contracts/Marketplace' 
import { providers, Contract, utils } from 'ethers'
import { Interface } from 'ethers/utils';
import swarm from './swarm'

export const treshold = async () => {
    try {
        const provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        const marketplace = new Contract(
            Marketplace.networks[network].address,
            Marketplace.abi,
            provider
        )
        return utils.formatEther(await marketplace.sellerStake())
    } catch (e) {
        throw Error(e.message)
    }
}

export const listingsFor = async (user) => {
    try {
        const provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        const event = (new Interface(Marketplace.abi)).events.LogCreateListing 
        const topics = [event.topic, null,  hexlify(padZeros(arrayify(user)))]
        let logs = await this.provider.getLogs({
            fromBlock: 0,
            toBlock: 'latest',
            topics: topics
        })
        logs = logs.map(l => event.decode(l.data, l.topics))
    } catch (e) {
        throw Error(e.message)
    }
}

export const getListing = async (id) => {
    try {
        // Fetch swarm hash 
        // Fetch Smart contract state
    } catch (e) {
        throw Error(e.message)
    }
}

export const createListing = async (listing) => {
    try {
        console.log(await swarm.bzz.upload(listing))
    } catch (e) {
        throw Error(e.message)
    }
}