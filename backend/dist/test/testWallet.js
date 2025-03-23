"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const walletService_1 = require("../services/walletService");
// Load environment variables
dotenv_1.default.config();
async function testWalletConnection() {
    const walletService = new walletService_1.WalletService();
    try {
        // Get wallet address from env
        const address = process.env.APTOS_ACCOUNT_ADDRESS;
        if (!address) {
            throw new Error('Wallet address not configured');
        }
        console.log('Testing wallet connection...');
        console.log('Wallet address:', address);
        // Initialize account first
        console.log('Initializing account...');
        await walletService.initializeAccount();
        // Get balance
        console.log('Fetching balance...');
        const balance = await walletService.getBalance(address);
        console.log('Wallet balance:', balance, 'APT');
        return balance;
    }
    catch (error) {
        console.error('Test failed:', error);
        throw error;
    }
}
// Run the test
testWalletConnection()
    .then(() => console.log('Test completed successfully'))
    .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
});
