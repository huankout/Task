import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
export default class UnstakeErc20 extends BaseCommand {

  public static commandName = 'unstake:erc721'

  public static description = ''

  public static settings = {

    loadApp: true,

  }
  @flags.number({ alias: 'unstakeERC721' })
  public tokenID: number
  public async run() {
    try {
      const { default: ConnectContractsController } = await import('App/Controllers/Http/ConnectContractsController')
      const contract = await new ConnectContractsController().StakingContract()

      const { tokenID } = this

      await contract.unstakeERC721(tokenID)

      this.logger.info(`unstake successfully ${tokenID} token`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }

  }
}
