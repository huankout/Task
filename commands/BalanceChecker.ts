import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { ethers } from 'ethers'

export default class BalanceChecker extends BaseCommand {

  public static commandName = 'balance:checker'


  public static description = 'check the balance of the ERC20 token'

  public static settings = {

    loadApp: true,


    // stayAlive: false,
  }
  @args.string({ description: 'Your address' })
  public address: string
  public async run() {
    try {
      const { default: fs } = await import('fs')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')

      const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'))

      const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider).connect(provider)

      const contractABI = JSON.parse(fs.readFileSync('./abi.json', 'utf-8'));

      const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

      const contract = new ethers.Contract(contractAddress, contractABI, wallet)

      const { address } = this

      const BalanceChecker = await contract.staking(address)
      this.logger.info(`Amount of staking ERC20Token ${BalanceChecker}`)


    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
