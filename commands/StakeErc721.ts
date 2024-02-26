import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
export default class StakeErc721 extends BaseCommand {

  public static commandName = 'stake:erc721'

  public static description = ''

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @flags.number({ alias: 'tokenID' })
  public tokenID: number
  public async run() {
    try {
      const { default: ConnectContractsController } = await import('App/Controllers/Http/ConnectContractsController')
      const contract = await new ConnectContractsController().StakingContract()

      const { tokenID } = this
      // Interaction with contract
      const transaction = await contract.stakeERC721(tokenID)


      // Wait for transaction confirmation
      await transaction.wait()

      this.logger.info(`Successfully staked ${tokenID}`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
