import { ethers } from 'ethers';
import Env from "@ioc:Adonis/Core/Env";
import ERC20ContractABI from "../../../ContractsABI/ERC20ContractABI.json";
import UniswapRouterABI from "../../../ContractsABI/UniswapRouterABI.json";
import StakingContractABI from "../../../ContractsABI/StakingContractABI.json";
import PoolABI from "../../../ContractsABI/PoolABI.json"
import IUniswapV3FactoryABI from "../../../ContractsABI/IUniswapV3FactoryABI.json"
const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))
export default class ConnectContracts {
    public async ERC20Contract(contractAddress, network) {
        const provider = new ethers.JsonRpcProvider(network);
        return new ethers.Contract(contractAddress, ERC20ContractABI, provider);
    }
    // public async ERC721Contract() {
    //     const netWork = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'));
    //     const contractAddress = Env.get('ERC721_CONTRACT_ADDRESS')
    //     return new ethers.Contract(contractAddress, ERC721ContractABI, netWork);
    // }
    public async StakingContract() {

        const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)

        const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

        return new ethers.Contract(contractAddress, StakingContractABI, wallet)
    }
    public async SwappingContract() {
        const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)
        const contractAddress = Env.get('UNISWAP_CONTRACT_ADDRESS')
        const abi = JSON.stringify(UniswapRouterABI)
        return new ethers.Contract(contractAddress, abi, wallet)
    }
    public async ConnectWallet() {
        return new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)
    }
    public async PoolContract(token0, token1, fee) {
        const factory = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c'
        const FactoryContract = new ethers.Contract(factory, IUniswapV3FactoryABI, provider)
        const V3pool = await FactoryContract.getPool(token0, token1, fee);

        // const poolAddress = Env.get('WETH_UNI_POOL_ADDRESS')
        return new ethers.Contract(V3pool, PoolABI, provider)
    }
}
