'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface TaskFormData {
  title: string;
  description: string;
  amount: string;
}

export default function CreateTask() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    amount: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      toast.success('Task created successfully!');
      router.push('/tasks/list');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back to Home
          </Button>
        </Link>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Title</label>
                <Input 
                  placeholder="Enter task title"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Description</label>
                <Textarea 
                  placeholder="Enter task description"
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Payment Amount (APT)</label>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, amount: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Task...' : 'Create Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
