import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
export default class UnstakeErc20 extends BaseCommand {

  public static commandName = 'unstake:erc20'

  public static description = ''

  public static settings = {

    loadApp: true,

  }
  @flags.number({ alias: 'unstakeERC20' })
  public amount: number
  public async run() {
    try {
      const { default: ConnectContractsController } = await import('App/Controllers/Http/ConnectContractsController')
      const contract = await new ConnectContractsController().StakingContract()

      const { amount } = this

      await contract.unstakeERC20(amount)

      this.logger.info(`unstake successfully ${amount} token`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }

  }
}
