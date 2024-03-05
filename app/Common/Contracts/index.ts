import { ethers } from 'ethers';
import Env from "@ioc:Adonis/Core/Env";
import ERC20ContractABI from "../../../ContractsABI/ERC20ContractABI.json";
import UniswapRouterABI from "../../../ContractsABI/UniswapRouterABI.json";
import StakingContractABI from "../../../ContractsABI/StakingContractABI.json";
// const { abi: FactoryAbi } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')

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
        const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))

        const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)

        const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

        return new ethers.Contract(contractAddress, StakingContractABI, wallet)
    }
    public async SwappingContract() {
        const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))
        const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)
        const contractAddress = Env.get('UNISWAP_CONTRACT_ADDRESS')
        const abi = JSON.stringify(UniswapRouterABI)
        return new ethers.Contract(contractAddress, abi, wallet)
    }
    public async ConnectWallet() {
        const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))
        return new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)
    }
}
