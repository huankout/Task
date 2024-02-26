import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContractValidator {
  constructor(protected ctx: HttpContextContract) { }
  public schema = schema.create({
    address: schema.string(),
    owner: schema.string(),
    functionNames: schema.array().members(schema.string()),
    // netWork: schema.string()
  });

  public messages = {
    'functionNames.minLength': 'At least one function name must be provided.',
  };
}
