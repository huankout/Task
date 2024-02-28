import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
export default class WithDrawErc20 extends BaseCommand {

  public static commandName = 'withdraw:erc721'

  public static description = 'withdraw ERC721'

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @flags.number({ alias: 'tokenID' })
  public tokenID: number
  public async run() {

    try {
      const { default: ConnectContracts } = await import('App/Common/Contracts/index')
      const contract = await new ConnectContracts().StakingContract()

      const { tokenID } = this

      await contract.withdrawERC721(tokenID)

      this.logger.info(`pending`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }

  }
}
