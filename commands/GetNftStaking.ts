import { BaseCommand, args } from '@adonisjs/core/build/standalone'
export default class GetNftStaking extends BaseCommand {

  public static commandName = 'staking:ERC721_info'

  public static description = 'Get all ID of current NFT staking'

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @args.string({ description: "owner address of NFT staking" })
  public address: string
  public async run() {
    try {
      const { default: ConnectContractsController } = await import('App/Controllers/Http/ConnectContractsController')
      const contract = await new ConnectContractsController().ERC721Contract()

      const { address } = this

      const getnftStaking = await contract.getnftStakings(address)
      this.logger.info(`ID of current NFT staking ${getnftStaking}`)


    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
