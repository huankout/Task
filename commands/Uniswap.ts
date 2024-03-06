import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import { ethers } from 'ethers'
import { Uint256 } from 'web3'
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

      const PoolContract = await new ConnectContracts().PoolContract(tokenIn, tokenOut, fee)

      const slot0 = await PoolContract.slot0();
      const PoolInfo = { "SqrtX96": slot0.sqrtPriceX96.toString(), "Pair": "WETH/UNI", "Decimal0": 18, "Decimal1": 18 }

      const sqrtPriceX96 = PoolInfo.SqrtX96;
      const Decimal0 = PoolInfo.Decimal0;
      const Decimal1 = PoolInfo.Decimal1;

      const buyOneOfToken0 = (((sqrtPriceX96 / 2 ** 96) ** 2) / (10 ** Decimal1 / 10 ** Decimal0))
      const buyOneOfToken1 = (1 / buyOneOfToken0)



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
      this.logger.info(`Successfully Swap ${tx.amountOut}`);
      this.logger.info(`1 WETH = ${buyOneOfToken0.toString()} UNI`);
      this.logger.info(`1 UNI = ${buyOneOfToken1.toString()} WETH`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}