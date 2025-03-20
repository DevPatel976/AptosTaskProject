import dotenv from 'dotenv';
import { WalletService } from '../services/walletService';

// Load environment variables
dotenv.config();

async function testWalletConnection() {
    const walletService = new WalletService();
    
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
    } catch (error) {
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
