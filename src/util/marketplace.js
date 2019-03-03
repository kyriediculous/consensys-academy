import Marketplace from '../../build/contracts/Marketplace'
import { providers, Contract } from 'ethers'
import { Interface, parseEther, formatEther } from 'ethers/utils'
import uport from './uport'

import swarm from './swarm'
import { info, approve } from './token'

const isDeployed = chainId => Marketplace.networks[chainId] !== undefined

export const buyListing = async (id, price, signer) => {
  try {
    let provider, marketplace
    switch (signer) {
      case 'uport':
        marketplace = uport.contract(Marketplace.abi).at(Marketplace.networks[uport.getProvider().network.id.substring(2)].address)
        await approve(marketplace.address, price, signer)
        await marketplace.buyListing(id, 'buyListing')
        await uport.onResponse('buyListing')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        marketplace = new Contract(
          Marketplace.networks[network].address,
          Marketplace.abi,
          provider.getSigner()
        )
        await approve(marketplace.address, price, signer)
        const tx = await marketplace.buyListing(id)
        await provider.waitForTransaction(tx.hash)
        break
    }
  } catch (e) {
    throw Error(e.message)
  }
}

export const treshold = async () => {
  try {
    const provider = new providers.JsonRpcProvider('https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53')
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

export const purchases = async (user) => {
  try {
    const provider = new providers.JsonRpcProvider('https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53')
    const network = (await provider.getNetwork()).chainId
    if (!isDeployed(network)) throw new Error('contract not deployed')
    const event = (new Interface(Marketplace.abi)).events.LogBuy
    let logs = await provider.getLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address: Marketplace.networks[network].address,
      topics: event.encodeTopics([null, user])
    })
    logs = logs.map(l => event.decode(l.data, l.topics))
    let meta = await Promise.all(logs.map(l => swarm.bzz.download(`${l.listing.substring(2)}/meta`)))
    meta = await Promise.all(meta.map(m => m.text()))
    meta = meta.map(m => JSON.parse(m))
    let tokens = await Promise.all(logs.map(l=> info(l.token)))
    logs =  logs.map( (l, i) => {
      return {
        ...l,
        ...meta[i],
        price: formatEther(l.price),
        token: {address: l.token, ...tokens[i]},
        image: `${swarm.bzz._url}/bzz:/${l.listing.substring(2)}/image`,
        timestamp: l.timestamp.toString(10)
      }
    })
    return logs
  } catch (e) {
    throw Error(e.message)
  }
}
export const listingsFor = async (user) => {
  try {
    const provider = new providers.JsonRpcProvider('https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53')
    const network = (await provider.getNetwork()).chainId
    if (!isDeployed(network)) throw new Error('contract not deployed')
    const event = (new Interface(Marketplace.abi)).events.LogCreateListing
    let logs = await provider.getLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address: Marketplace.networks[network].address,
      topics: event.encodeTopics([null, user])
    })
    logs = logs.map(l => event.decode(l.data, l.topics))
    return await Promise.all(logs.map(l => getListing(l.listing)))
  } catch (e) {
    throw Error(e.message)
  }
}

export const getListing = async (id) => {
  try {
    const provider = new providers.JsonRpcProvider('https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53')
    const network = (await provider.getNetwork()).chainId
    const marketplace = new Contract(
      Marketplace.networks[network].address,
      Marketplace.abi,
      provider
    )
    // Fetch swarm hash with bzz-list
    let meta, ethData
    [meta, ethData] = await Promise.all([
      swarm.bzz.download(`${id.substring(2)}/meta`),
      marketplace.getListing(id)
    ])
    meta = JSON.parse(await meta.text())
    return ({
      id: id,
      token: { address: ethData[1], ...await info(ethData[1]) },
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

export const createListing = async (listing, signer) => {
  try {
    // Format for swarm manifest upload
    const formattedListing = {
      ebook: { data: listing.ebook, contentType: listing.ebook.type },
      image: { data: listing.image, contentType: listing.image.type },
      meta: {
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
    let provider, marketplace
    switch (signer) {
      case 'uport':
        marketplace = uport.contract(Marketplace.abi).at(Marketplace.networks[uport.getProvider().network.id.substring(2)].address)
        await marketplace.createListing(id, listing.token, parseEther(listing.price.toString()), listing.activate, 'createListing')
        await uport.onResponse('createListing')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        marketplace = new Contract(
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
        break
    }
  } catch (e) {
    throw Error(e.message)
  }
}
