"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const ApiError_1 = require("../utils/ApiError");
class WalletService {
    constructor() {
        const config = new ts_sdk_1.AptosConfig({ network: ts_sdk_1.Network.TESTNET });
        this.aptos = new ts_sdk_1.Aptos(config);
        // Initialize account from private key
        const privateKeyHex = process.env.APTOS_PRIVATE_KEY;
        if (!privateKeyHex) {
            throw new Error('Private key not configured');
        }
        // Format private key according to AIP-80
        const formattedKey = new ts_sdk_1.Ed25519PrivateKey(Buffer.from(privateKeyHex, 'hex'));
        this.account = ts_sdk_1.Account.fromPrivateKey({ privateKey: formattedKey });
    }
    async initializeAccount() {
        try {
            const address = this.account.accountAddress.toString();
            console.log('Initializing account:', address);
            // Check if account exists
            try {
                await this.aptos.getAccountInfo({ accountAddress: address });
                console.log('Account already exists');
                return;
            }
            catch (error) {
                // Account doesn't exist, initialize it
                console.log('Account does not exist, initializing...');
                // Use faucet to create account and fund it
                const faucetUrl = process.env.APTOS_FAUCET_URL;
                if (!faucetUrl) {
                    throw new Error('Faucet URL not configured');
                }
                await this.aptos.fundAccount({
                    accountAddress: this.account.accountAddress,
                    amount: 100000000, // 1 APT
                });
                console.log('Account initialized successfully');
            }
        }
        catch (error) {
            console.error('Failed to initialize account:', error);
            throw new ApiError_1.ApiError(500, 'Failed to initialize account');
        }
    }
    async getBalance(address) {
        try {
            const accountResources = await this.aptos.getAccountResources({
                accountAddress: address,
            });
            // Find the APT coin resource
            const aptosCoin = accountResources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
            if (!aptosCoin || !aptosCoin.data) {
                return 0;
            }
            // Type assertion for the coin data structure
            const coinData = aptosCoin.data;
            return Number(coinData.coin.value) / 100000000; // Convert from octas to APT
        }
        catch (error) {
            console.error('Failed to get balance:', error);
            throw new ApiError_1.ApiError(500, 'Failed to get balance');
        }
    }
    async verifyPayment(amount, userId) {
        try {
            const accountAddress = process.env.APTOS_ACCOUNT_ADDRESS;
            if (!accountAddress) {
                throw new Error('Aptos account address not configured');
            }
            // Get account resources
            const balance = await this.getBalance(accountAddress);
            console.log('Current balance:', balance, 'APT');
            return balance >= amount;
        }
        catch (error) {
            console.error('Payment verification failed:', error);
            return false;
        }
    }
    async processPayment(amount, fromAddress) {
        try {
            const toAddress = process.env.APTOS_ACCOUNT_ADDRESS;
            if (!toAddress) {
                throw new Error('Aptos account address not configured');
            }
            const transaction = await this.aptos.transferCoinTransaction({
                sender: ts_sdk_1.AccountAddress.fromString(fromAddress),
                recipient: ts_sdk_1.AccountAddress.fromString(toAddress),
                amount: BigInt(amount * 100000000), // Convert APT to Octas
            });
            const pendingTransaction = await this.aptos.signAndSubmitTransaction({
                signer: this.account,
                transaction,
            });
            const response = await this.aptos.waitForTransaction({
                transactionHash: pendingTransaction.hash,
            });
            return response.hash;
        }
        catch (error) {
            console.error('Payment processing failed:', error);
            throw new ApiError_1.ApiError(500, 'Payment processing failed');
        }
    }
}
exports.WalletService = WalletService;
