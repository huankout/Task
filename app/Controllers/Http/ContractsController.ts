import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ConnectContractsController from "App/Controllers/Http/ConnectContractsController";
import ContractValidator from 'App/Validators/ContractValidator';

export default class ContractsController {

    public async readContract({ request, response }: HttpContextContract) {
        try {

            const payload = await request.validate(ContractValidator);


            const contract = await new ConnectContractsController().ERC20Contract(payload.address);

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
                    default:
                        return response.status(400).send({ error: 'Invalid function specified' });
                }
            }
            console.log(results)
            // Return the results
            return response.status(200).send(results);

        } catch (error) {
            console.error('Error:', error);
            return response.status(500).send({ error: 'An error occurred while reading the contract' });
        }
    }
}
