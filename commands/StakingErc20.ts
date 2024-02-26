import { BaseCommand, flags } from '@adonisjs/ace'

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
      const { default: ConnectContractsController } = await import('App/Controllers/Http/ConnectContractsController')
      const contract = await new ConnectContractsController().StakingContract()

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
