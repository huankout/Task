import { BaseCommand } from '@adonisjs/core/build/standalone'
export default class WithDrawErc20 extends BaseCommand {

  public static commandName = 'withdraw:erc20'

  public static description = 'withdraw ERC20'

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  // @args.string({ description: 'token owner address' })
  // public address: string
  public async run() {

    try {
      const { default: ConnectContracts } = await import('App/Common/Contracts/index')
      const contract = await new ConnectContracts().StakingContract()

      // const { address } = this

      await contract.withdrawERC20()

      this.logger.info(`pending`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }

  }
}
