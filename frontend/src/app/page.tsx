import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="Autonomous Task Executor Logo"
              width={100}
              height={100}
              priority
              className="animate-float"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Autonomous Task Executor
          </h1>
          <p className="text-gray-300 text-lg">
            Execute tasks with secure crypto payments on Aptos blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create Task</CardTitle>
              <CardDescription className="text-gray-400">
                Define your task and set payment terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tasks/create" className="block w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  New Task
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">My Tasks</CardTitle>
              <CardDescription className="text-gray-400">
                View and manage your tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tasks/list" className="block w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  View Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-gray-400">
                Link your Aptos wallet to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnect />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
