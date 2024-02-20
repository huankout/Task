import { BaseCommand } from '@adonisjs/core/build/standalone'
import { ethers } from 'ethers'
export default class WithDrawErc20 extends BaseCommand {

  public static commandName = 'withdraw:erc20'

  public static description = 'with'

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  // @args.string({ description: 'token owner address' })
  // public address: string
  public async run() {

    try {
      const { default: fs } = await import('fs')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')

      const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'))

      const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider).connect(provider)

      const contractABI = JSON.parse(fs.readFileSync('./abi.json', 'utf-8'));

      const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

      const contract = new ethers.Contract(contractAddress, contractABI, wallet)

      // const { address } = this

      await contract.withdrawERC20()

      this.logger.info(`pending`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }

  }
}
