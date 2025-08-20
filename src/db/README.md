# Database Seeding

This directory contains database seeding scripts for populating your database with initial data.

## Files

- `seed.ts` - Main seeding script that runs all seeds
- `seed-products.ts` - Seeds the products table with software agency services
- `../data/products.json` - JSON data file containing product information

## Usage

### Seed All Data
```bash
npm run db:seed
```

### Seed Products Only
```bash
npm run db:seed-products
```

## Product Data

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

## Adding New Seeds

1. Create your seed script in this directory (e.g., `seed-users.ts`)
2. Import and call it from `seed.ts`
3. Add a corresponding npm script in `package.json`
4. Follow the existing pattern for error handling and logging

## Data Structure

Products are stored with the following fields:
- `id` - Auto-generated unique identifier
- `name` - Service/product name
- `price` - Price in USD
- `description` - Detailed description of the service
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last updated

## Notes

- Seeding clears existing data before inserting new data
- All timestamps are automatically handled by the database schema
- The seed scripts can be run multiple times safely