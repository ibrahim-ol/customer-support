# Database Seeding

This directory contains database seeding scripts for populating your database with initial data.

## Files

- `seed.ts` - Main seeding script that runs all seeds
- `seed-products.ts` - Seeds the products table with software agency services
- `seed-conversations.ts` - Seeds conversation data with realistic customer interactions
- `../data/products.json` - JSON data file containing product information
- `../data/conversations.json` - JSON data file containing conversation scenarios

## Usage

### Seed All Data
```bash
npm run db:seed
```

### Seed Products Only
```bash
npm run db:seed-products
```

### Seed Conversations Only
```bash
npm run db:seed-conversations
```

## Data Overview

### Product Data

The products are designed for a small software agency that builds web apps and software solutions. The services include:

- **Custom Web Application Development** - Full-stack web apps
- **E-commerce Platform Development** - Complete online stores
- **Mobile App Development** - Cross-platform mobile apps
- **API Development & Integration** - REST APIs and third-party integrations
- **Legacy System Modernization** - Updating outdated systems
- **Cloud Migration & DevOps Setup** - AWS/Azure/GCP migrations
- **Database Design & Optimization** - Database architecture and performance
- **Software Consulting & Technical Audit** - Technical assessments
- **MVP Development** - Minimum viable products
- **Software Maintenance & Support** - Ongoing support services
- **Progressive Web App Development** - PWA solutions
- **Custom CRM Development** - Tailored CRM systems
- **Automation & Workflow Solutions** - Process automation
- **Data Analytics Dashboard Development** - BI dashboards
- **Security Assessment & Implementation** - Security audits and fixes

### Conversation Data

The conversations represent realistic customer service interactions across different scenarios and communication channels:

**10 Different Conversation Types:**
1. **Technical Support** - Bug fixes and troubleshooting (frustrated → satisfied)
2. **Product Inquiry** - Service exploration and questions (neutral → excited)
3. **Billing Clarification** - Invoice confusion resolution (confused → satisfied)
4. **Feature Requests** - Enhancement discussions (neutral → excited)
5. **Service Complaints** - Problem resolution (angry → satisfied)
6. **General Curiosity** - Educational conversations (neutral → excited)
7. **Misdirected Inquiries** - Wrong department navigation (confused → satisfied)
8. **Positive Feedback** - Success stories and praise (happy → excited)
9. **Emergency Issues** - Urgent problem resolution (frustrated → satisfied)
10. **Educational Support** - Concept explanations (neutral → satisfied)

**Conversation Features:**
- **Length**: 15-30 messages per conversation for realistic depth
- **Mood Progression**: Natural emotional journeys with multiple mood transitions
- **Multiple Channels**: Web chat, email, and phone interactions
- **Diverse Personas**: Various customer types and communication styles
- **Business Scenarios**: Real-world problems and solutions

**Database Integration:**
- Creates conversation records with customer details and channel information
- Generates realistic message exchanges between users and AI assistant
- Tracks mood changes throughout conversations with proper linking
- Includes AI-generated summaries for each complete conversation

## Adding New Seeds

1. Create your seed script in this directory (e.g., `seed-users.ts`)
2. Import and call it from `seed.ts`
3. Add a corresponding npm script in `package.json`
4. Follow the existing pattern for error handling and logging

## Data Structure

### Products Table
- `id` - Auto-generated unique identifier
- `name` - Service/product name
- `price` - Price in USD
- `description` - Detailed description of the service
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last updated

### Conversations Table
- `id` - Auto-generated unique identifier
- `customerName` - Customer's name
- `channel` - Communication channel (web_chat, email, phone)
- `status` - Conversation status (active, killed)
- `mood` - Final mood state of the conversation
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last updated

### Chat Table
- `id` - Auto-generated unique identifier
- `message` - Message content
- `role` - Message sender (user, assistant)
- `userId` - User ID (null for customer support context)
- `conversationId` - Foreign key to conversations table
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last updated

### Mood Tracking Table
- `id` - Auto-generated unique identifier
- `conversationId` - Foreign key to conversations table
- `mood` - Mood state (happy, frustrated, confused, angry, satisfied, neutral, excited, disappointed)
- `messageId` - Foreign key to chat table (for user messages)
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last updated

### AI Summary Table
- `id` - Auto-generated unique identifier
- `conversationId` - Foreign key to conversations table
- `summary` - AI-generated conversation summary
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last updated

## Notes

- Seeding clears existing data before inserting new data
- All timestamps are automatically handled by the database schema
- The seed scripts can be run multiple times safely