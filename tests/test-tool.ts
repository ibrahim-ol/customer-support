import { generateReply } from "../src/services/ai.service.ts";

async function testProductTool() {
  console.log("🧪 Testing AI product tool functionality...\n");

  // Test case 1: General service inquiry
  console.log("Test 1: General service inquiry");
  try {
    const result1 = await generateReply({
      conversationSummary: "Customer asking about available services",
      chatHistory: [
        {
          role: "user",
          message:
            "Hi, I'm interested in learning about what services you offer. Can you tell me what your company does?",
        },
      ],
    });

    console.log("AI Response:", result1.text);
    console.log("Tool Calls:", result1.toolCalls?.length || 0);
    console.log("Tool Results:", result1.toolResults?.length || 0);
    console.log("---\n");
  } catch (error) {
    console.error("Error in test 1:", error);
  }

  // Test case 2: Specific service inquiry (e-commerce)
  console.log("Test 2: Specific service inquiry (e-commerce)");
  try {
    const result2 = await generateReply({
      conversationSummary: "Customer asking about e-commerce solutions",
      chatHistory: [
        {
          role: "user",
          message:
            "I need help building an online store for my business. Do you offer e-commerce development services and what would that cost?",
        },
      ],
    });

    console.log("AI Response:", result2.text);
    console.log("Tool Calls:", result2.toolCalls?.length || 0);
    console.log("Tool Results:", result2.toolResults?.length || 0);
    console.log("---\n");
  } catch (error) {
    console.error("Error in test 2:", error);
  }

  // Test case 3: Mobile app inquiry
  console.log("Test 3: Mobile app inquiry");
  try {
    const result3 = await generateReply({
      conversationSummary: "Customer asking about mobile app development",
      chatHistory: [
        {
          role: "user",
          message:
            "Do you build mobile apps? I need something for both iPhone and Android users.",
        },
      ],
    });

    console.log("AI Response:", result3.text);
    console.log("Tool Calls:", result3.toolCalls?.length || 0);
    console.log("Tool Results:", result3.toolResults?.length || 0);
    console.log("---\n");
  } catch (error) {
    console.error("Error in test 3:", error);
  }

  // Test case 4: Pricing inquiry
  console.log("Test 4: Pricing inquiry");
  try {
    const result4 = await generateReply({
      conversationSummary: "Customer asking about pricing for web development",
      chatHistory: [
        {
          role: "user",
          message:
            "What are your typical prices for web application development? I'm trying to budget for a project.",
        },
      ],
    });

    console.log("AI Response:", result4.text);
    console.log("Tool Calls:", result4.toolCalls?.length || 0);
    console.log("Tool Results:", result4.toolResults?.length || 0);
    console.log("---\n");
  } catch (error) {
    console.error("Error in test 4:", error);
  }

  // Test case 5: Non-service related question (should not use tool)
  console.log("Test 5: Non-service related question");
  try {
    const result5 = await generateReply({
      conversationSummary: "Customer asking unrelated question",
      chatHistory: [
        {
          role: "user",
          message: "What's the weather like today?",
        },
      ],
    });

    console.log("AI Response:", result5.text);
    console.log("Tool Calls:", result5.toolCalls?.length || 0);
    console.log("Tool Results:", result5.toolResults?.length || 0);
    console.log("---\n");
  } catch (error) {
    console.error("Error in test 5:", error);
  }

  console.log("✅ Tool testing completed!");
}

// Run the test
testProductTool().catch(console.error);
