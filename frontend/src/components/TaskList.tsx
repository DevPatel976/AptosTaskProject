import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface Task {
  _id: string;
  description: string;
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
  cost: number;
  steps: {
    description: string;
    status: string;
    result?: string;
  }[];
  paymentStatus: string;
  createdAt: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWallet();

  useEffect(() => {
    if (account?.address) {
      fetchTasks();
    }
  }, [account]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks/user/${account?.address}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'executing':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (!account) {
    return (
      <div className="text-center py-8 text-gray-600">
        Connect your wallet to view tasks
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No tasks found. Create a new task to get started!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{task.description}</h3>
              <p className="text-sm text-gray-500">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Steps:</h4>
            <div className="space-y-2">
              {task.steps.map((step, index) => (
                <div key={index} className="text-sm">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        step.status === 'completed'
                          ? 'bg-green-500'
                          : step.status === 'failed'
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <p>{step.description}</p>
                  </div>
                  {step.result && (
                    <p className="ml-4 mt-1 text-gray-600">{step.result}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Cost: {task.cost} APT
            </div>
            <div className="text-sm">
              Payment Status: {task.paymentStatus}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
