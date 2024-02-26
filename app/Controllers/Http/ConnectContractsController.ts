import { ethers } from 'ethers';
import Env from "@ioc:Adonis/Core/Env";
import ERC20ContractABI from "../../../ERC20ContractABI.json";

export default class ConnectContractsController {
    public async ERC20Contract() {
        const netWork = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'));
        const contractAddress = Env.get('DEFAULT_CONTRACT')
        const ERC20ABI = JSON.stringify(ERC20ContractABI);

        return new ethers.Contract(contractAddress, ERC20ABI, netWork);
    }
}
