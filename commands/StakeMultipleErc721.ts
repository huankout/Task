import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
export default class StakeMultipleErc721 extends BaseCommand {

  public static commandName = 'stake:multiple_erc721'

  public static description = ''

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @flags.numArray({ alias: 'TokenID' })
  public NFTTokenID: number[];
  public async run() {
    try {
      const { default: ConnectContracts } = await import('App/Common/Contracts/index')
      const contract = await new ConnectContracts().StakingContract()

      const { NFTTokenID } = this
      // Interaction with contract
      const transaction = await contract.stakeMultipleERC721(NFTTokenID)
      // Wait for transaction confirmation
      await transaction.wait()
      this.logger.info(`Successfully staked ${NFTTokenID}`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}

