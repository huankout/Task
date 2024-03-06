import { BaseCommand, args } from '@adonisjs/core/build/standalone';
import { ethers } from 'ethers';

export default class SignMessage extends BaseCommand {

  public static commandName = 'sign:message';

  public static description = 'Sign a message using a private key';

  public static settings = {
    loadApp: true
  }

  @args.string({ description: 'Message to sign' })
  public message: string;

  public async run() {
    try {
      const { message } = this;
      // Retrieve the private key from environment variables
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey) {
        throw new Error("Private key is not provided in environment variables.");
      }
      // Validate the private key
      const wallet = new ethers.Wallet(privateKey);
      // Sign the message
      const signature = await wallet.signMessage(message);
      // Output the results
      this.logger.info(`Message: ${message}`);
      this.logger.info(`Signature: ${signature}`);
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
    }
  }
}
