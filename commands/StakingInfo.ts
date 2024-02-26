import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { ethers } from 'ethers'
export default class StakingInfo extends BaseCommand {

  public static commandName = 'staking:info'

  public static description = 'get staking info'

  public static settings = {

    loadApp: true,

  }
  @args.string({ description: 'owner address' })
  public address: string

  public async run() {
    try {
      const { default: fs } = await import('fs')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')

      const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'))

      const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)

      const contractABI = JSON.parse(fs.readFileSync('./StakingContractABI.json', 'utf-8'));

      const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

      const contract = new ethers.Contract(contractAddress, contractABI, wallet)

      const { address } = this

      const pendingInfo: { [key: string]: any } = await contract.pendingERC20Withdrawals(address)
      const ownerInfo = await contract.owner()
      // const StakingInfo = await contract.staking(address)
      this.logger.info(`amount: ${pendingInfo.amount}`)
      this.logger.info(`applicableAt: ${pendingInfo.applicableAt}`)
      this.logger.info(`owner: ${ownerInfo}`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}