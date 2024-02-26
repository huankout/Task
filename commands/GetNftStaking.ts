import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { ethers } from "ethers";
export default class GetNftStaking extends BaseCommand {

  public static commandName = 'get:nft_staking'

  public static description = 'Get all ID of current NFT staking'

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @args.string({ description: "owner address of NFT staking" })
  public address: string
  public async run() {
    try {
      const { default: fs } = await import('fs')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')

      const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'))

      const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)

      const contractABI = JSON.parse(fs.readFileSync('./StakingContractABI.json', 'utf-8'));

      const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

      const contract = new ethers.Contract(contractAddress, contractABI, wallet)

      const { address } = this

      const getnftStaking = await contract.getnftStakings(address)
      this.logger.info(`ID of current NFT staking ${getnftStaking}`)


    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
