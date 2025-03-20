'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Task {
  _id: string;
  description: string;
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
  cost: number;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/list');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const executeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute task');
      }
      
      await fetchTasks();
      toast.success('Task execution started');
    } catch (error) {
      console.error('Error executing task:', error);
      toast.error('Failed to execute task');
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'executing':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const getPaymentStatusColor = (status: Task['paymentStatus']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'processing':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back to Home
          </Button>
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <Link href="/tasks/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create New Task
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center text-gray-400 py-8">
              No tasks found. Create your first task!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task._id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex justify-between items-center">
                    <span className="truncate">{task.description}</span>
                    <span className="text-sm text-blue-400">{task.cost} APT</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className={getStatusColor(task.status)}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment:</span>
                      <span className={getPaymentStatusColor(task.paymentStatus)}>
                        {task.paymentStatus.charAt(0).toUpperCase() + task.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-gray-300">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        className="text-blue-400 border-blue-400 hover:bg-blue-400/10 flex-1"
                        onClick={() => router.push(`/tasks/${task._id}`)}
                      >
                        View Details
                      </Button>
                      {task.status === 'pending' && (
                        <Button 
                          className="bg-green-600 hover:bg-green-700 flex-1"
                          onClick={() => executeTask(task._id)}
                        >
                          Execute Task
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
