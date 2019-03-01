import Marketplace from '../../build/contracts/Marketplace'
import { providers, Contract } from 'ethers'
import { Interface, parseEther, formatEther } from 'ethers/utils'
import { Connect } from 'uport-connect'

import swarm from './swarm'
import { info, approve } from './token'

export const buyListing = async (id, price, signer) => {
  try {
    let provider
    switch(signer) {
      case 'uport':
        console.log(new Connect('VuePort', {network: 'ropsten' }))
        provider = new providers.Web3Provider(new Connect('VuePort'))
        break;
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        break;
    }
    console.log("BUY PROVIDER", provider)
    const network = (await provider.getNetwork()).chainId
    console.log("NETWORK", network)
    const marketplace = new Contract(
        Marketplace.networks[network].address,
        Marketplace.abi,
        provider.getSigner()
    )
    await approve(marketplace.address, price)
    const tx = await marketplace.buyListing(id)
    await provider.waitForTransaction(tx.hash)
  } catch (e) {
      throw Error(e.message)
  }
}

export const treshold = async () => {
    try {
        const provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        const marketplace = new Contract(
            Marketplace.networks[network].address,
            Marketplace.abi,
            provider
        )
        return formatEther(await marketplace.sellerStake())
    } catch (e) {
        throw Error(e.message)
    }
}

export const listingsFor = async (user) => {
    try {
        const provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        const event = (new Interface(Marketplace.abi)).events.LogCreateListing
        let logs = await provider.getLogs({
            fromBlock: 0,
            toBlock: 'latest',
            topics: event.encodeTopics([null, user])
        })
        logs = logs.map(l => event.decode(l.data, l.topics))
        console.log( await Promise.all(logs.map(l => getListing(l.listing))))
        return await Promise.all(logs.map(l => getListing(l.listing)))
    } catch (e) {
        throw Error(e.message)
    }
}

export const getListing = async (id) => {
    try {
        const provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        const marketplace = new Contract(
            Marketplace.networks[network].address,
            Marketplace.abi,
            provider
        )
        // Fetch swarm hash with bzz-list
        let manifest, meta, ethData
        [manifest, meta, ethData] = await Promise.all([
          swarm.bzz.list(id.substring(2)),
          swarm.bzz.download(`${id.substring(2)}/meta`),
          marketplace.getListing(id)
        ])
        meta = JSON.parse(await meta.text())
        return ({
          id: id,
          token: {address: ethData[1], ...await info(ethData[1])},
          price: formatEther(ethData[2]),
          seller: ethData[3],
          active: ethData[4],
          title: meta.title,
          summary: meta.summary,
          author: meta.author,
          image: `${swarm.bzz._url}/bzz:/${id.substring(2)}/image`,
          ebook: `${swarm.bzz._url}/bzz:/${id.substring(2)}/ebook`,
          manifest: `${swarm.bzz._url}/bzz-list:/${id.substring(2)}`
        })
        // Fetch Smart contract state
    } catch (e) {
        throw Error(e.message)
    }
}

export const createListing = async (listing) => {
    try {
        //Format for swarm manifest upload
        const formattedListing = {
          ebook: { data: listing.ebook, contentType: listing.ebook.type},
          image: { data: listing.image, contentType: listing.image.type },
          meta : {
            data: JSON.stringify(
              {
                title: listing.title,
                summary: listing.summary,
                author: listing.author
              }
            ),
            contentType: 'application/json'
          }
        }
        // Upload to swarm
        const id = '0x' + await swarm.bzz.upload(formattedListing)
        // Create listing on blockchain
        const provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        const marketplace = new Contract(
            Marketplace.networks[network].address,
            Marketplace.abi,
            provider.getSigner()
        )
        let tx = await marketplace.createListing(
          id,
          listing.token,
          parseEther(listing.price.toString()),
          listing.activate
        )
        await provider.waitForTransaction(tx.hash)
    } catch (e) {
        throw Error(e.message)
    }
}
