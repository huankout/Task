import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { ethers } from 'ethers'
export default class UnstakeErc20 extends BaseCommand {

  public static commandName = 'unstake:erc20'

  public static description = ''

  public static settings = {

    loadApp: true,

  }
  @flags.number({ alias: 'u' })
  public amount: number
  public async run() {
    try {
      const { default: fs } = await import('fs')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')

      const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'))

      const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider).connect(provider)

      const contractABI = JSON.parse(fs.readFileSync('./abi.json', 'utf-8'));

      const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

      const contract = new ethers.Contract(contractAddress, contractABI, wallet)

      const { amount } = this

      await contract.unstakeERC20(amount)

      this.logger.info(`unstake successfully ${amount} token`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }

  }
}
