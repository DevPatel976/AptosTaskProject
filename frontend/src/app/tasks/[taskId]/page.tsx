'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Task {
  _id: string;
  description: string;
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
  cost: number;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  steps: Array<{
    description: string;
    status: 'pending' | 'completed' | 'failed';
    result?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetail() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [params.taskId]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${params.taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task');
    } finally {
      setIsLoading(false);
    }
  };

  const executeTask = async () => {
    try {
      setIsExecuting(true);
      const response = await fetch(`/api/tasks/${params.taskId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute task');
      }
      
      const data = await response.json();
      setTask(data);
      toast.success('Task execution started');
      router.refresh();
    } catch (error) {
      console.error('Error executing task:', error);
      toast.error('Failed to execute task');
    } finally {
      setIsExecuting(false);
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-400 py-8">Loading task...</div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-400 py-8">Task not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/tasks/list">
          <Button variant="outline" className="mb-6">
            ← Back to Tasks
          </Button>
        </Link>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center">
              <span className="truncate">Task Details</span>
              <span className="text-sm text-blue-400">{task.cost} APT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-gray-400 mb-2">Description</h3>
                <p className="text-white whitespace-pre-wrap">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-gray-400 mb-2">Status</h3>
                  <p className={getStatusColor(task.status)}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-gray-400 mb-2">Payment Status</h3>
                  <p className={getPaymentStatusColor(task.paymentStatus)}>
                    {task.paymentStatus.charAt(0).toUpperCase() + task.paymentStatus.slice(1)}
                  </p>
                </div>
              </div>

              {task.steps.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-gray-400 mb-2">Steps</h3>
                  <div className="space-y-2">
                    {task.steps.map((step, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-white">{step.description}</span>
                        <span className={getStatusColor(step.status)}>
                          {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-gray-400 mb-2">Created</h3>
                  <p className="text-white">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-gray-400 mb-2">Last Updated</h3>
                  <p className="text-white">
                    {new Date(task.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {task.status === 'pending' && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={executeTask}
                  disabled={isExecuting}
                >
                  {isExecuting ? 'Executing...' : 'Execute Task'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
