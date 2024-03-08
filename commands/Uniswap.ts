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
      const { tokenIn, tokenOut, fee, recipient, inputAmount, amountOutMinimum, sqrtPriceLimitX96 } = this
      const amountIn = ethers.parseUnits(inputAmount.toString(), 18)

      const contract = await new ConnectContracts().SwappingContract()

      const tokenInConnect = await new ConnectContracts().ERC20Connect(tokenIn, amountIn)

      const tokenOutConnect = await new ConnectContracts().ERC20Connect(tokenOut, amountIn)

      const PoolContract = await new ConnectContracts().PoolContract(tokenIn, tokenOut, fee)

      const slot0 = await PoolContract.slot0();

      const PoolInfo = { "SqrtX96": slot0.sqrtPriceX96.toString(), "Decimal0": 18, "Decimal1": 18 }

      const sqrtPriceX96 = PoolInfo.SqrtX96;
      const Decimal0 = PoolInfo.Decimal0;
      const Decimal1 = PoolInfo.Decimal1;

      const buyOneOfToken0 = (((sqrtPriceX96 / 2 ** 96) ** 2) / (10 ** Decimal1 / 10 ** Decimal0))

      const buyOneOfToken1 = (1 / buyOneOfToken0)

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const params = {
        tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96
      }
      const overrides = {
        gasPrice: 1000000000,
        gasLimit: 1000000,
      };

      const tx = await contract.exactInputSingle(params, overrides)

      await tx.wait()

      const amountOut = inputAmount / buyOneOfToken0

      const nameTokenIn = await tokenInConnect.symbol()
      const nameTokenOut = await tokenOutConnect.symbol()

      this.logger.info(`You pay ${inputAmount} ${nameTokenIn} and receive ${amountOut} ${nameTokenOut}`);
      this.logger.info(`1 ${nameTokenOut} = ${buyOneOfToken0.toString()} ${nameTokenIn}`);
      this.logger.info(`1 ${nameTokenIn} = ${buyOneOfToken1.toString()} ${nameTokenOut}`)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
    }
  }
}