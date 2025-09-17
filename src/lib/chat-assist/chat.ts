'use server'

import { app, config, model } from "./config"


export const AskAI = async ({  
  content,  
}:{content:string}) => {
    console.log('chatting with ai');
    try {
        
        const result = await app.invoke({messages:content},config)
        
        const output = result.messages[result.messages.length - 1].content
                
        console.log('success ai response');
        
        return output
    } catch (error) {
        console.log('failed',error);
        return null
    }
}


// works for auth users
