import { BaseCommand, args } from '@adonisjs/core/build/standalone'
export default class StakingInfo extends BaseCommand {

  public static commandName = 'staking:ERC20_info'

  public static description = 'get staking info'

  public static settings = {

    loadApp: true,

  }
  @args.string({ description: 'owner address' })
  public address: string

  public async run() {
    try {
      const { default: ConnectContractsController } = await import('App/Controllers/Http/ConnectContractsController')
      const contract = await new ConnectContractsController().StakingContract()

      const { address } = this

      const pendingInfo = await contract.pendingERC20Withdrawals(address)
      const ownerInfo = await contract.owner()
      const stakingERC20 = await contract.staking(address)
      // const StakingInfo = await contract.staking(address)
      this.logger.info(`Pending amount: ${pendingInfo.amount}`)
      this.logger.info(`applicableAt: ${pendingInfo.applicableAt}`)
      this.logger.info(`owner: ${ownerInfo}`)
      this.logger.info(`Amount of staking ERC20Token: ${stakingERC20}`)

    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}