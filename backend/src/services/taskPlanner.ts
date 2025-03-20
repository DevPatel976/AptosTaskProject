import { ITaskStep, StepStatus } from '../models/Task';

export class TaskPlanner {
  async estimateCost(description: string): Promise<number> {
    // Analyze task complexity and estimate cost in APT tokens
    try {
      const response = await (new (require('openai')).OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })).chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "Analyze the task complexity and estimate cost in APT tokens (1-10)."
        }, {
          role: "user",
          content: description
        }],
      });

      const estimatedCost = parseFloat(response.choices[0].message.content || "1");
      return Math.max(1, Math.min(10, estimatedCost));
    } catch (error) {
      return 1; // Default minimum cost
    }
  }

  async planTask(description: string): Promise<ITaskStep[]> {
    // For NFT minting tasks, return predefined steps
    if (description.toLowerCase().includes('nft')) {
      return [
        { description: 'Initialize NFT module structure', status: 'pending' as StepStatus },
        { description: 'Implement metadata handling', status: 'pending' as StepStatus },
        { description: 'Add minting functionality', status: 'pending' as StepStatus },
        { description: 'Implement royalty fee mechanism', status: 'pending' as StepStatus },
        { description: 'Add transfer restrictions', status: 'pending' as StepStatus },
        { description: 'Set up ownership tracking', status: 'pending' as StepStatus },
        { description: 'Write unit tests', status: 'pending' as StepStatus },
        { description: 'Deploy and verify', status: 'pending' as StepStatus }
      ];
    }

    // For token swap tasks
    if (description.toLowerCase().includes('swap')) {
      return [
        { description: 'Set up token swap module', status: 'pending' as StepStatus },
        { description: 'Implement price calculation', status: 'pending' as StepStatus },
        { description: 'Add slippage protection', status: 'pending' as StepStatus },
        { description: 'Implement swap execution', status: 'pending' as StepStatus },
        { description: 'Add error handling', status: 'pending' as StepStatus },
        { description: 'Write unit tests', status: 'pending' as StepStatus },
        { description: 'Deploy and verify', status: 'pending' as StepStatus }
      ];
    }

    // Default steps for other tasks
    return [
      { description: 'Analyze requirements', status: 'pending' as StepStatus },
      { description: 'Design solution', status: 'pending' as StepStatus },
      { description: 'Implement core functionality', status: 'pending' as StepStatus },
      { description: 'Add error handling', status: 'pending' as StepStatus },
      { description: 'Write tests', status: 'pending' as StepStatus },
      { description: 'Deploy and verify', status: 'pending' as StepStatus }
    ];
  }

  async executeStep(step: ITaskStep): Promise<string> {
    // Simulate step execution with appropriate delays
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `Completed: ${step.description}`;
  }

  async executeSteps(steps: ITaskStep[]): Promise<ITaskStep[]> {
    for (const step of steps) {
      try {
        const result = await this.executeStep(step);
        step.status = 'completed' as StepStatus;
        step.result = result;
      } catch (error) {
        step.status = 'failed' as StepStatus;
        step.result = 'Step execution failed';
        throw error;
      }
    }
    
    return steps;
  }
}
