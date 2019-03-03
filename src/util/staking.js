import Staking from '../../build/contracts/Staking'
import { approve } from './token'
import { providers, Contract, utils } from 'ethers'
import uport from './uport'

const isDeployed = chainId => Staking.networks[chainId] !== undefined

export async function token () {
  const provider = new providers.JsonRpcProvider('https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53')
  const network = (await provider.getNetwork()).chainId
  if (!isDeployed(network)) throw new Error('contract not deployed')
  const staking = new Contract(
    Staking.networks[network].address,
    Staking.abi,
    provider
  )
  return (await staking.token())
}

export async function staked (user) {
  try {
    const provider = new providers.JsonRpcProvider('https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53')
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

export async function stake (amount, signer) {
  try {
    let provider, staking
    switch (signer) {
      case 'uport':
        staking = uport.contract(Staking.abi).at(Staking.networks[uport.getProvider().network.id.substring(2)].address)
        await approve(staking.address, amount, signer)
        await staking.stake(utils.parseEther(amount.toString()), 'addStake')
        await uport.onResponse('addStake')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        staking = new Contract(
          Staking.networks[network].address,
          Staking.abi,
          provider.getSigner()
        )
        await approve(staking.address, amount, signer)
        const tx = await staking.stake(utils.parseEther(amount.toString()))
        await provider.waitForTransaction(tx.hash)
        break
    }
  } catch (e) {
    console.log(e)
    throw Error(e.message)
  }
}

export async function unstake (amount, signer) {
  try {
    let provider, staking
    switch (signer) {
      case 'uport':
        staking = uport.contract(Staking.abi).at(Staking.networks[uport.getProvider().network.id.substring(2)].address)
        await staking.unstake(utils.parseEther(amount.toString()), 'unStake')
        await uport.onResponse('unStake')
        break
      case 'metamask':
        provider = new providers.Web3Provider(window.ethereum)
        const network = (await provider.getNetwork()).chainId
        staking = new Contract(
          Staking.networks[network].address,
          Staking.abi,
          provider.getSigner()
        )
        const tx = await staking.unstake(utils.parseEther(amount.toString()))
        await provider.waitForTransaction(tx.hash)
        break
    }
  } catch (e) {
    console.log(e)
    throw Error(e.message)
  }
}
