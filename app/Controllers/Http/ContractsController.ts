import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { ethers } from 'ethers'
interface ContractInput {
    address?: string;
    owner?: string;
    functionNames?: string[];
}

export default class ContractsController {
    public async readContract({ request, response }: HttpContextContract) {
        // Parse input data from the request body
        const input: ContractInput = request.body();
        // Connect to an Ethereum node
        const provider = new ethers.JsonRpcProvider(Env.get('MY_PROVIDER'));

        // ERC-20 contract address
        const contractAddress = input.address || Env.get('DEFAULT_CONTRACT');

        // ERC-20 contract ABI
        const abi = Env.get('CONTRACT_ABI');

        const ownerAddress = input.owner || Env.get('MY_DEFAULT_ADDRESS');

        // Instantiate the contract
        const contract = new ethers.Contract(contractAddress, abi, provider);

        try {
            // Map to store results for each function
            const results: { [key: string]: any } = {};
            // Execute each function and store the results
            for (const functionName of request.input('functionNames')) {
                results[functionName] = await executeFunction(functionName);
            }
            async function executeFunction(functionName: string): Promise<any> {
                switch (functionName) {
                    case 'getTokenBalance':
                        return await getTokenBalance(ownerAddress);
                    case 'getAllowance':
                        return await getAllowance(ownerAddress, contractAddress);
                    case 'getDecimals':
                        return await getDecimals();
                    case 'getSymbol':
                        return await getSymbol();
                    case 'getName':
                        return await getName();
                    case 'getTotalSupply':
                        return await getTotalSupply();
                    default:
                        return response.status(400).send({ error: 'Invalid function specified' });
                }
            }
            // Return the results
            return response.status(200).send(results);


        } catch (error) {

            console.error('Error:', error);
            return response.status(500).send({ error: 'An error occurred while reading the contract' });
        }


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
    }
}
