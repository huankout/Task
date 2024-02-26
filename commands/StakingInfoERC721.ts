import { BaseCommand, args } from '@adonisjs/core/build/standalone'
export default class BalanceOfErc721 extends BaseCommand {

  public static commandName = 'staking:ERC721_info'

  public static description = 'Check ID of the NFT that user are currently holding'

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @args.string({ description: "Owner address" })
  public address: string
  public async run() {
    try {
      const { default: ConnectContractsController } = await import('App/Controllers/Http/ConnectContractsController')
      const contract = await new ConnectContractsController().StakingContract()

      const { address } = this

      const BalanceChecker = await contract.balanceOf(address)
      this.logger.info(`Balance of NFT currently holding ${BalanceChecker}`)


    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
