import Token from '../../build/contracts/Token'
import { providers, Contract, utils } from 'ethers'

export async function approve (to, amount) {
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const network = (await provider.getNetwork()).chainId
    const token = new Contract(
      Token.networks[network].address,
      Token.abi,
      provider.getSigner()
    )
    await token.approve(to, utils.parseEther(amount.toString()))
  } catch (e) {
    throw new Error(e.message)
  }
}

export async function balanceOf (user) {
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const network = (await provider.getNetwork()).chainId
    const token = new Contract(
      Token.networks[network].address,
      Token.abi,
      provider.getSigner()
    )
    return utils.formatEther(await token.balanceOf(user))
  } catch (e) {
    throw new Error(e.message)
  }
}

export async function info (address = undefined) {
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const network = (await provider.getNetwork()).chainId
    const token = new Contract(
      address || Token.networks[network].address,
      Token.abi,
      provider.getSigner()
    )
    let name, symbol, decimals
    [name, symbol, decimals] =  await Promise.all([
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
    throw new Error(e.message)
  }
}
