// Import necessary modules
import { BaseCommand, flags } from '@adonisjs/ace'
import { ethers } from 'ethers'

export default class StakeToken extends BaseCommand {
  public static commandName = 'stake:token'
  public static description = 'Stake tokens'
  public static settings = {
    loadApp: true
  }
  @flags.number({ alias: 'a' })
  public amountToStake: number;
  public async run() {
    try {
      const { default: fs } = await import('fs')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')
      // Connect to Ethereum provider
      const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'))

      // Connect to wallet
      const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider).connect(provider)

      // Load your contract ABI and address
      // const contractABI = Env.get('STAKING_CONTRACT_ABI')
      const contractABI = JSON.parse(fs.readFileSync('./abi.json', 'utf-8'));
      const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')
      const contract = new ethers.Contract(contractAddress, contractABI, wallet)

      const { amountToStake } = this
      // Interaction with contract
      const transaction = await contract.stakeERC20(amountToStake)


      // Wait for transaction confirmation
      await transaction.wait()

      this.logger.info(`Successfully staked ${amountToStake}`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
