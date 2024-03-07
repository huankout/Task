import { ethers } from 'ethers';
import Env from "@ioc:Adonis/Core/Env";
import ERC20ContractABI from "../../../ContractsABI/ERC20ContractABI.json";
import UniswapRouterABI from "../../../ContractsABI/UniswapRouterABI.json";
import StakingContractABI from "../../../ContractsABI/StakingContractABI.json";
import PoolABI from "../../../ContractsABI/PoolABI.json"
import IUniswapV3FactoryABI from "../../../ContractsABI/IUniswapV3FactoryABI.json"

const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))
const signer = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)
const uniswapAddress = Env.get('UNISWAP_CONTRACT_ADDRESS')
const factory = Env.get('FACTORY_ADDRESS')

export default class ConnectContracts {

    public async ERC20Contract(contractAddress, network) {
        new ethers.JsonRpcProvider(network);
        return new ethers.Contract(contractAddress, ERC20ContractABI, signer);
    }
    public async ERC20Connect(tokenIn, inputAmount) {
        const contract = new ethers.Contract(tokenIn, ERC20ContractABI, signer)
        const overrides = {
            gasPrice: 1000000000,
            gasLimit: 100000,
        };
        await contract.approve(uniswapAddress, inputAmount, overrides)

        await contract.transfer(uniswapAddress, inputAmount, overrides)

        return contract
    }
    public async StakingContract() {
        const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

        return new ethers.Contract(contractAddress, StakingContractABI, signer)
    }
    public async SwappingContract() {
        return new ethers.Contract(uniswapAddress, UniswapRouterABI, signer)
    }

    public async PoolContract(tokenIn, tokenOut, fee) {
        const FactoryContract = new ethers.Contract(factory, IUniswapV3FactoryABI, signer)

        const poolAddress = await FactoryContract.getPool(tokenIn, tokenOut, fee)

        const connect = new ethers.Contract(poolAddress, PoolABI, provider)
        return connect
    }
}
