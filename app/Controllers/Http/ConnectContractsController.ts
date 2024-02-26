import { ethers } from 'ethers';
import Env from "@ioc:Adonis/Core/Env";
import ERC20ContractABI from "../../../ContractsABI/ERC20ContractABI.json";
import ERC721ContractABI from "../../../ContractsABI/ERC721ContractABI.json";
import StakingContractABI from "../../../ContractsABI/StakingContractABI.json";

export default class ConnectContractsController {
    public async ERC20Contract(contractAddress) {
        const netWork = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'));
        const ERC20ABI = JSON.stringify(ERC20ContractABI);

        return new ethers.Contract(contractAddress, ERC20ABI, netWork);
    }
    public async ERC721Contract() {
        const netWork = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'));
        const contractAddress = Env.get('ERC721_CONTRACT_ADDRESS')
        const ERC721ABI = JSON.stringify(ERC721ContractABI);

        return new ethers.Contract(contractAddress, ERC721ABI, netWork);
    }
    public async StakingContract() {
        const provider = new ethers.JsonRpcProvider(Env.get('SEPOLIA_PROVIDER'))

        const wallet = new ethers.Wallet(Env.get('PRIVATE_KEY'), provider)

        const contractABI = JSON.stringify(StakingContractABI);

        const contractAddress = Env.get('STAKING_CONTRACT_ADDRESS')

        return new ethers.Contract(contractAddress, contractABI, wallet)
    }
}
