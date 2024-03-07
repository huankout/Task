import { ethers } from 'ethers';
import Env from "@ioc:Adonis/Core/Env";
import ERC20ContractABI from "../../../ContractsABI/ERC20ContractABI.json";
import UniswapRouterABI from "../../../ContractsABI/UniswapRouterABI.json";
import StakingContractABI from "../../../ContractsABI/StakingContractABI.json";
import PoolABI from "../../../ContractsABI/PoolABI.json"
import IUniswapV3FactoryABI from "../../../ContractsABI/IUniswapV3FactoryABI.json"

const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))
const signer = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)

export default class ConnectContracts {

    public async ERC20Contract(contractAddress, network) {
        new ethers.JsonRpcProvider(network);
        return new ethers.Contract(contractAddress, ERC20ContractABI, signer);
    }
    public async ERC20Connect(tokenIn, inputAmount) {
        const contract = new ethers.Contract(tokenIn, ERC20ContractABI, signer)

        await contract.transferFrom(Env.get('MY_DEFAULT_ADDRESS'), Env.get('UNISWAP_CONTRACT_ADDRESS'), inputAmount)

        await contract.approve(Env.get('UNISWAP_CONTRACT_ADDRESS'), inputAmount)

        return contract
    }
    public async StakingContract() {
        const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

        return new ethers.Contract(contractAddress, StakingContractABI, signer)
    }
    public async SwappingContract() {
        const contractAddress = Env.get('UNISWAP_CONTRACT_ADDRESS')

        return new ethers.Contract(contractAddress, UniswapRouterABI, signer)
    }

    public async PoolContract(tokenIn, tokenOut, fee) {
        const factory = Env.get('FACTORY_ADDRESS')

        const FactoryContract = new ethers.Contract(factory, IUniswapV3FactoryABI, signer)

        const poolAddress = await FactoryContract.getPool(tokenIn, tokenOut, fee)
        const connect = new ethers.Contract(poolAddress, PoolABI, provider)
        console.log(poolAddress)

        return connect
    }
}
