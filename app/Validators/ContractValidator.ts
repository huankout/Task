import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

enum functions {
  'TokenBalance',
  'Allowance',
  'Decimals',
  'Symbol',
  'Name',
  'TotalSupply'
}
enum network {
  'https://sepolia.infura.io/v3/7ee172a909e943a99ca6803a055bd79d',
  'https://goerli.infura.io/v3/7ee172a909e943a99ca6803a055bd79d',
  'Goerli',
  'goerli',
  'Sepolia',
  'sepolia'
}
const functionValues = Object.keys(functions).filter((v) => isNaN(Number(v)))
const networkValues = Object.keys(network).filter((v) => isNaN(Number(v)))
export default class ContractValidator {
  constructor(protected ctx: HttpContextContract) {
  }
  public schema = schema.create({
    address: schema.string([rules.minLength(42), rules.maxLength(42), rules.alphaNum()]),
    owner: schema.string([rules.minLength(42), rules.maxLength(42)]),
    functionNames: schema.array([rules.distinct('*')]).members(schema.enum(functionValues)),
    netWork: schema.enum(networkValues),
  })
  public messages = {
    'address.range': `Invalid address`,
    'owner': `Invalid owner`,
    'enum': `Invalid function`,
    'netWork.enum': `Invalid network`
  };

}
