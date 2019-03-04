import Marketplace from '../../build/contracts/Marketplace'
import { providers, Contract } from 'ethers'
import { Interface, parseEther, formatEther } from 'ethers/utils'
import uport from './uport'
import networks from './networks'

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
        if (!window.ethereum) throw new Error("Metamask is not installed, please download metamask at https://metamask.io");
        await window.ethereum.enable()
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
    const provider = new providers.JsonRpcProvider(networks[process.env.VUE_APP_NETWORK].rpcUrl)
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
    const provider = new providers.JsonRpcProvider(networks[process.env.VUE_APP_NETWORK].rpcUrl)
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
    let meta = await Promise.all(logs.map(l => swarm.bzz.download(`${l.manifest.substring(2)}/meta`)))
    meta = await Promise.all(meta.map(m => m.text()))
    meta = meta.map(m => JSON.parse(m))
    let tokens = await Promise.all(logs.map(l => info(l.token)))
    logs = logs.map((l, i) => {
      return {
        ...l,
        ...meta[i],
        price: formatEther(l.price),
        token: { address: l.token, ...tokens[i] },
        image: `${swarm.bzz._url}/bzz:/${l.manifest.substring(2)}/image`,
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
    const provider = new providers.JsonRpcProvider(networks[process.env.VUE_APP_NETWORK].rpcUrl)
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
    logs = await Promise.all(logs.map(l => getListing(l.listing)))
    return logs
  } catch (e) {
    throw Error(e.message)
  }
}

export const getListing = async (id) => {
  try {
    const provider = new providers.JsonRpcProvider(networks[process.env.VUE_APP_NETWORK].rpcUrl)
    const network = (await provider.getNetwork()).chainId
    const marketplace = new Contract(
      Marketplace.networks[network].address,
      Marketplace.abi,
      provider
    )

    let ethData = await marketplace.getListing(id)
    let meta
    if (!ethData[0].startsWith('0x0000000000') ) {
      meta = await swarm.bzz.download(`${ethData[0].substring(2)}/meta`)
      meta = JSON.parse(await meta.text())
    } else {
      meta = {}
    }

    return ({
      id: id,
      token: { address: ethData[1], ...await info(ethData[1]) },
      price: formatEther(ethData[2]),
      seller: ethData[3],
      active: ethData[4],
      title: meta.title,
      summary: meta.summary,
      author: meta.author,
      image: `${swarm.bzz._url}/bzz:/${ethData[0].substring(2)}/image`,
      ebook: `${swarm.bzz._url}/bzz:/${ethData[0].substring(2)}/ebook`,
      manifest: `${swarm.bzz._url}/bzz-list:/${ethData[0].substring(2)}`,
      manifestHash: ethData[0]
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

export const changeStatus = async (id, signer) => {
  try {
    let provider, marketplace
    switch (signer) {
      case 'uport':
        marketplace = uport.contract(Marketplace.abi).at(Marketplace.networks[uport.getProvider().network.id.substring(2)].address)
        await marketplace.changeListingStatus(id, 'changeListingStatus')
        await uport.onResponse('changeListingStatus')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        marketplace = new Contract(
          Marketplace.networks[network].address,
          Marketplace.abi,
          provider.getSigner()
        )
        let tx = await marketplace.changeListingStatus(id)
        await provider.waitForTransaction(tx.hash)
        break
    }
  } catch (e) {
    throw Error(e.message)
  }
}

export const changePricing = async (id, price, token, signer) => {
  try {
    let provider, marketplace
    switch (signer) {
      case 'uport':
        marketplace = uport.contract(Marketplace.abi).at(Marketplace.networks[uport.getProvider().network.id.substring(2)].address)
        await marketplace.changeListingPrice(id, formatEther(price.toString()), token, 'changeListingPrice')
        await uport.onResponse('changeListingPrice')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        marketplace = new Contract(
          Marketplace.networks[network].address,
          Marketplace.abi,
          provider.getSigner()
        )
        let tx = await marketplace.changeListingPrice(id, formatEther(price.toString()), token)
        await provider.waitForTransaction(tx.hash)
        break
    }
  } catch (e) {
    throw Error(e.message)
  }
}

export const changeManifest = async (id, manifest, signer) => {
  try {
    let provider, marketplace
    switch (signer) {
      case 'uport':
        marketplace = uport.contract(Marketplace.abi).at(Marketplace.networks[uport.getProvider().network.id.substring(2)].address)
        await marketplace.changeListingManifest(id, manifest, 'changeListingManifest')
        await uport.onResponse('changeListingManifest')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        marketplace = new Contract(
          Marketplace.networks[network].address,
          Marketplace.abi,
          provider.getSigner()
        )
        let tx = await marketplace.changeListingManifest(id, manifest)
        await provider.waitForTransaction(tx.hash)
        break
    }
  } catch (e) {
    throw Error(e.message)
  }
}
