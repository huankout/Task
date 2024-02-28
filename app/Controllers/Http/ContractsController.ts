import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ConnectContracts from "App/Common/Contracts/index";
import ContractValidator from 'App/Validators/ContractValidator';

export default class ContractsController {

    public async readContract({ request, response }: HttpContextContract) {
        const payload = await request.validate(ContractValidator);
        if (payload.network == "Goerli" || "goerli") {
            payload.network = Env.get('GOERLI_PROVIDER')
        } else if (payload.network == "Sepolia" || "sepolia") {
            payload.network = Env.get('SEPOLIA_PROVIDER')
        }
        const contract = await new ConnectContracts().ERC20Contract(payload.address, payload.network);

        // Parse payload data from the request body
        const results: { [key: string]: any } = {};

        for (const functionName of payload.functionNames) {
            results[functionName] = await executeFunction(functionName);
        }
        async function executeFunction(functionName: string) {
            switch (functionName) {
                case 'TokenBalance':
                    return results.TokenBalance = await contract.balanceOf(payload.owner);
                case 'Allowance':
                    return results.Allowance = await contract.allowance(payload.owner, payload.address);
                case 'Decimals':
                    return results.Decimals = await contract.decimals();
                case 'Symbol':
                    return results.Symbol = await contract.symbol();
                case 'Name':
                    return results.Name = await contract.name();
                case 'TotalSupply':
                    return results.TotalSupply = await contract.totalSupply();
            }
        }
        // Return the results
        return response.status(200).send(results);

    }
}