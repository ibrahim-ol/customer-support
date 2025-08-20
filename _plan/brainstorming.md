> The plan is to build something, 
- This thing will be integrated as a telegram chat bot
- It will act as a store front ai and a customer service ai
- It will answer faqs and market services to Customers
- It will evaluate the customers interest and mood based on the questions they ask
- The admin can takeover conversation and still get help from the ai by showing the interest level and mood of the customer and suggesting replies to the admin
- notify admin if the conversation tone become critical and llm can't continue/de-escalate

### To build
- a classifier
  - classify the tone of the conversation based on the current flow
- a summarizer
  - summarize a conversation to keep the token size in check
- a response suggester
  - generate possible responses based on helpful, status quo, convince



## Idea
 mood evaluator 
 - evaluates the mood of the users based on the messages
	- telegram bot
	- clerk / better auth
	- tanstack start
	- convex for db / neon / sqlite local
	- deepseek
	- hono
	- vercel ai sdk