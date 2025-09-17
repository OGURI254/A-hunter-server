import { Agent, setDefaultOpenAIKey, setTracingExportApiKey, tool } from '@openai/agents';
import z from 'zod/v3';


setDefaultOpenAIKey(process.env.OPENAI_API_KEY!)
setTracingExportApiKey(process.env.OPENAI_API_KEY!)

console.log(process.env.OPENAI_API_KEY);
const historyFunFact:any = tool({  
  name: 'history_fun_fact',
  description: 'Give a fun fact about a historical event',  
  parameters: z.object({}),
  execute: async () => {    
    return 'Sharks are older than trees.';
  },
});

export const agent = new Agent({
  name: 'History Tutor',
  instructions:
    'You provide assistance with historical queries. Explain important events and context clearly.',
  // Adding the tool to the agent
  tools: [historyFunFact],
  
});