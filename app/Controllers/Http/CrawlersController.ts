import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ethers } from 'ethers';
import Env from '@ioc:Adonis/Core/Env'
export default class CrawlersController {
    public async crawlERC20({ response }: HttpContextContract) {
        // const itsContract = await new ConnectContracts().ConnectToken()
        const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))
        // const signer = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)
        var filter = {

            address: Env.get('ERC20_CONTRACT_ADDRESS'),
            fromBlock: 5441445,
            ToBlock: 5326188,
        }

        const transaction = await provider.getBlock("0xaaa7f00e889e1ff08d7409c77b6dc6a767735a2b6be4ad3107de6dba26ff25c7f6")
        console.log(transaction)

        return response.status(200)
    }
}
