'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const petra = (window as any).petra;
      if (petra) {
        const account = await petra.account();
        if (account) {
          setIsConnected(true);
          setWalletAddress(account.address);
        }
      }
    } catch (error: any) {
      // Don't show error on initial check
      console.log('Not connected to wallet');
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const petra = (window as any).petra;
      if (!petra) {
        toast.error('Petra wallet not found. Please install Petra wallet first.');
        window.open('https://petra.app/', '_blank');
        return;
      }

      await petra.connect();
      const account = await petra.account();
      setIsConnected(true);
      setWalletAddress(account.address);
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4100) {
        toast.error('Please approve the connection request in Petra wallet');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const petra = (window as any).petra;
      if (petra) {
        await petra.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        toast.success('Wallet disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={isConnected ? disconnectWallet : connectWallet}
        className={`w-full ${
          isConnected 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white relative`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            Connecting...
          </span>
        ) : isConnected ? (
          'Connected'
        ) : (
          'Connect Wallet'
        )}
      </Button>
      {isConnected && walletAddress && (
        <div className="text-center">
          <p className="text-sm text-gray-400 break-all">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
          <button
            onClick={disconnectWallet}
            className="text-xs text-red-400 hover:text-red-300 mt-1"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
