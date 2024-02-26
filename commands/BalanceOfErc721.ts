import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { ethers } from "ethers";
export default class BalanceOfErc721 extends BaseCommand {

  public static commandName = 'balance:of_erc721'

  public static description = 'Check ID of the NFT that user are currently holding'

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @args.string({ description: "Owner address" })
  public address: string
  public async run() {
    try {
      const { default: fs } = await import('fs')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')

      const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'))

      const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)

      const contractABI = JSON.parse(fs.readFileSync('./ERC721ContractABI.json', 'utf-8'));

      const contractAddress = Env.get('NFT_CONTRACT_ADDRESS')

      const contract = new ethers.Contract(contractAddress, contractABI, wallet)

      const { address } = this

      const BalanceChecker = await contract.balanceOf(address)
      this.logger.info(`Balance of NFT currently holding ${BalanceChecker}`)


    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
