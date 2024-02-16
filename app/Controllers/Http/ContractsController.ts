import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { ethers } from 'ethers'

// Define an interface for the input data
interface ContractInput {
    address?: string;
    owner?: string;
    function?: string[];
}

export default class ContractsController {
    public async readContract({ request, response }: HttpContextContract) {
        try {
            // Parse input data from the request query parameters
            const input: ContractInput = request.qs();

            // Validate input data
            // if (!input.address && !input.owner) {
            //     return response.status(400).send({ error: 'At least one of address and owner must be provided' });
            // }
            // if (!input.function) {
            //     return response.status(400).send({ error: 'At least one of function must be provided' })
            // }

            // Connect to an Ethereum node
            const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'));

            // ERC-20 contract address
            const contractAddress = input.address || Env.get('DEFAULT_CONTRACT'); // Default contract address

            // ERC-20 contract ABI
            const abi = Env.get('CONTRACT_ABI');

            // Instantiate the contract
            const contract = new ethers.Contract(contractAddress, abi, provider);

            // Choose the function to run based on the query parameter
            const ownerAddress = input.owner || Env.get('MY_DEFAULT_ADDRESS');

            let result: any;
            switch (request.input('function')) {
                case 'balance':
                    result = await getTokenBalance(ownerAddress);
                    break;
                case 'allowance':
                    result = await getAllowance(ownerAddress, contractAddress);
                    break;
                case 'decimals':
                    result = await getDecimals();
                    break;
                case 'symbol':
                    result = await getSymbol();
                    break;
                case 'name':
                    result = await getName();
                    break;
                case 'totalSupply':
                    result = await getTotalSupply();
                    break;
                default:
                    return response.status(400).send({ error: 'Invalid function specified' });
            }


            // Return the result
            const readContract = {
                [request.input('function')]: result
            };
            return response.status(200).send({ readContract });

            async function getTokenBalance(address: string): Promise<string> {
                const balance: ethers.Numeric = await contract.balanceOf(address);
                return balance.toString();
            }

            async function getAllowance(owner: string, spender: string): Promise<string> {
                const allowance: ethers.Numeric = await contract.allowance(owner, spender);
                return allowance.toString();
            }

            async function getDecimals(): Promise<number> {
                const decimals: number = await contract.decimals();
                return decimals;
            }

            async function getSymbol(): Promise<string> {
                const symbol: string = await contract.symbol();
                return symbol;
            }

            async function getName(): Promise<string> {
                const name: string = await contract.name();
                return name;
            }

            async function getTotalSupply(): Promise<string> {
                const totalSupply: ethers.Numeric = await contract.totalSupply();
                return totalSupply.toString();
            }
        } catch (error) {
            console.error('Error:', error);
            return response.status(500).send({ error: 'An error occurred while reading the contract' });
        }


    }
}
