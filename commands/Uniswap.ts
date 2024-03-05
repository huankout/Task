import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import { ethers } from 'ethers'
export default class Uniswap extends BaseCommand {

  public static commandName = 'uniswap'

  public static description = ''

  public static settings = {

    loadApp: true,

    stayAlive: false,
  }
  @args.string({})
  public tokenIn: string

  @args.string({})
  public tokenOut: string

  @flags.number({ alias: 'fee' })
  public fee: number

  @args.string({})
  public recipient: string

  @flags.number({ alias: 'inputAmount' })
  public inputAmount: number

  @flags.number({ alias: 'amountOutMinimum' })
  public amountOutMinimum: number

  @flags.number({ alias: 'sqrtPriceLimitX96' })
  public sqrtPriceLimitX96: number

  public async run() {
    try {
      const { default: ConnectContracts } = await import('App/Common/Contracts/index')
      const contract = await new ConnectContracts().SwappingContract()
      const { tokenIn, tokenOut, fee, recipient, inputAmount, amountOutMinimum, sqrtPriceLimitX96 } = this

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const amountIn = ethers.parseUnits(inputAmount.toString(), 18)

      const params = {
        tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96
      }
      const overrides = {
        gasPrice: 1000000000,
        gasLimit: 1000000,
      };
      const tx = await contract.exactInputSingle(params, overrides)

      await tx.wait()
      this.logger.info(`Successfully Swap`);

    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}
