import Token from '../../build/contracts/Token'
import { providers, Contract, utils } from 'ethers'
import uport from './uport'
import networks from './networks'
// const isDeployed = chainId => Token.networks[chainId] !== undefined

export async function approve (to, amount, signer) {
  try {
    let provider, token
    switch (signer) {
      case 'uport':
        token = uport.contract(Token.abi).at(Token.networks[uport.getProvider().network.id.substring(2)].address)
        await token.approve(to, utils.parseEther(amount.toString()), 'ERC20approve')
        await uport.onResponse('ERC20approve')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        token = new Contract(
          Token.networks[network].address,
          Token.abi,
          provider.getSigner()
        )
        let tx = await token.approve(to, utils.parseEther(amount.toString()))
        await provider.waitForTransaction(tx.hash)
        break
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

export async function balanceOf (user) {
  try {
    const provider = new providers.JsonRpcProvider(networks[process.env.VUE_APP_NETWORK].rpcUrl)
    const network = (await provider.getNetwork()).chainId
    const token = new Contract(
      Token.networks[network].address,
      Token.abi,
      provider
    )
    return utils.formatEther(await token.balanceOf(user))
  } catch (e) {
    throw new Error(e.message)
  }
}

export async function info (address) {
  try {
    const provider = new providers.JsonRpcProvider(networks[process.env.VUE_APP_NETWORK].rpcUrl)
    const network = (await provider.getNetwork()).chainId
    const token = new Contract(
      address || Token.networks[network].address,
      Token.abi,
      provider
    )
    let name, symbol, decimals
    [name, symbol, decimals] = await Promise.all([
      token.name(),
      token.symbol(),
      token.decimals()
    ])
    return {
      name,
      symbol,
      decimals
    }
  } catch (e) {
    throw Error(e.message)
  }
}
