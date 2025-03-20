import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface TaskCreationFormProps {
  onSubmit: (description: string) => Promise<void>;
}

export function TaskCreationForm({ onSubmit }: TaskCreationFormProps) {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !account) return;

    try {
      setIsLoading(true);
      await onSubmit(description);
      setDescription('');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your task in detail..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !account}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isLoading || !account 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
        {!account && (
          <p className="text-sm text-red-500 mt-2">
            Please connect your wallet to create tasks
          </p>
        )}
      </form>
    </div>
  );
}
