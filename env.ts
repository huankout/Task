/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
	HOST: Env.schema.string({ format: 'host' }),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	APP_NAME: Env.schema.string(),
	DRIVE_DISK: Env.schema.enum(['local'] as const),
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
	// CONTRACT_ABI: Env.schema.string(),
	SEPOLIA_PROVIDER: Env.schema.string(),
	MY_DEFAULT_ADDRESS: Env.schema.string(),
	ERC20_CONTRACT_ADDRESS: Env.schema.string(),
	PRIVATE_KEY: Env.schema.string(),
	// STAKING_CONTRACT_ABI: Env.schema.string(),
	STAKING_CONTRACT_ADDRESS: Env.schema.string(),
	ERC721_CONTRACT_ADDRESS: Env.schema.string(),
	GOERLI_PROVIDER: Env.schema.string(),
	UNISWAP_CONTRACT_ADDRESS: Env.schema.string(),
	WETH_UNI_POOL_ADDRESS: Env.schema.string(),
	FACTORY_ADDRESS: Env.schema.string(),
})
