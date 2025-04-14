import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { getAIResponse } from './openaiService';

// Initialize OpenAI model - replace with your real key or environment variable
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'sk-proj-lvdACCRJwEgtGNcWDc3Ggzn5eNzlEpn7rkLm5qF';

// Create a ChatOpenAI instance
const chatModel = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  modelName: "gpt-4o", // Using GPT-4o for advanced capabilities
  temperature: 0.2,
  streaming: true,
});

// Flight booking system context
const systemContext = `You are SkyJourney's AI assistant, helping users with flight bookings and travel information.
- You can provide information about flights, destinations, and travel requirements.
- You can assist with booking processes and explain cancellation policies.
- You can suggest popular travel destinations and offer travel tips.
- Be concise but informative in your responses.
- For flight searches, ask for departure city, destination, and travel dates if not provided.
- For specific booking issues, suggest contacting customer service.

Important flight booking information:
- SkyJourney partners with over 500 airlines worldwide
- Bookings can be modified up to 24 hours before departure
- A flexible booking option is available for an additional fee
- SkyJourney offers a price match guarantee
- Payment methods include all major credit cards, PayPal, and Apple Pay
- All prices include taxes and basic baggage allowance
`;

// Create prompt template
const promptTemplate = PromptTemplate.fromTemplate(`
{systemContext}

Current conversation:
{chatHistory}

User: {userInput}

Please provide a helpful response:
`);

// Create langchain chain
export const createChatChain = () => {
  return RunnableSequence.from([
    {
      systemContext: () => systemContext,
      chatHistory: (input) => input.chatHistory || "",
      userInput: (input) => input.userInput,
    },
    promptTemplate,
    chatModel,
    new StringOutputParser(),
  ]);
};

// Simple fallback implementation without LangChain dependencies
export const processMessageWithLangchain = async (message, chatHistory, apiCallback) => {
  console.log('Processing message with fallback system');
  
  try {
    // Try to process with OpenAI service
    const response = await getAIResponse(message, chatHistory);
    return { message: response };
  } catch (error) {
    console.error('Error with AI processing, falling back to API:', error);
    
    // Fall back to the provided API callback
    if (typeof apiCallback === 'function') {
      try {
        return await apiCallback(message);
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
      }
    }
    
    // Final fallback if both OpenAI and API callback fail
    return { 
      message: "I'm sorry, but I'm currently experiencing technical difficulties. Please try again later or contact our customer service for immediate assistance." 
    };
  }
};