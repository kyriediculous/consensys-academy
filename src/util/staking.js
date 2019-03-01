import Staking from '../../build/contracts/Staking'
import Token from '../../build/contracts/Token'
import { providers, Contract, utils } from 'ethers'

const isDeployed = chainId => Staking.networks[chainId] !== undefined

export async function token () {
  const provider = new providers.Web3Provider(window.ethereum)
  const network = (await provider.getNetwork()).chainId
  const staking = new Contract(
    Staking.networks[network].address,
    Staking.abi,
    provider.getSigner()
  )
  return await staking.token()
}

export async function staked (user) {
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const network = (await provider.getNetwork()).chainId
    const staking = new Contract(
      Staking.networks[network].address,
      Staking.abi,
      provider
    )
    return utils.formatEther(await staking.stakes(user))
  } catch (e) {
    throw Error(e.message)
  }
}

export async function stake (amount) {
  try {
    if (typeof window.ethereum !== undefined) {
      const provider = new providers.Web3Provider(window.ethereum)
      const network = (await provider.getNetwork()).chainId
      const token = new Contract(
        Token.networks[network].address,
        Token.abi,
        provider.getSigner()
      )
      const staking = new Contract(
        Staking.networks[network].address,
        Staking.abi,
        provider.getSigner()
      )
      let tx = await token.approve(staking.address, utils.parseEther(amount.toString()))
      await provider.waitForTransaction(tx.hash)
      tx  = await staking.stake(utils.parseEther(amount.toString()))
      await provider.waitForTransaction(tx.hash)
    } else {
      throw new Error('No injected web3 found')
    }
  } catch (e) {
    console.log(e)
    throw Error(e.message)
  }
}

export async function unstake (amount) {
  try {
    if (typeof window.web3 !== undefined) {
      const provider = new providers.Web3Provider(window.ethereum)
      const network = (await provider.getNetwork()).chainId
      const staking = new Contract(
        Staking.networks[network].address,
        Staking.abi,
        provider.getSigner(0)
      )
      let tx = await staking.unstake(utils.parseEther(amount.toString()))
      await provider.waitForTransaction(tx.hash)
    } else {
      throw new Error('No injected web3 found')
    }
  } catch (e) {
    console.log(e)
    throw Error(e.message)
  }
}
