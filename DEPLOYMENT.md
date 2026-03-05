# ILAKA Deployment Guide

## Local Setup
1. Install dependencies:
   - `npm install`
2. Configure environment:
   - Copy `.env.example` to `.env` and fill in values.
3. Enable PostGIS:
   - Connect to your Neon/Supabase database and run:
     - `CREATE EXTENSION IF NOT EXISTS postgis;`
4. Prisma:
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`

## Neon DB Setup
1. Create a Neon project and database.
2. Copy the connection string into `DATABASE_URL`.
3. Enable PostGIS in Neon SQL editor:
   - `CREATE EXTENSION IF NOT EXISTS postgis;`

## Pinecone Setup
1. Create a Pinecone project.
2. Create an index named `ilaka-events`:
   - Dimension: 1536 (OpenAI text-embedding-3-small)
   - Metric: cosine
3. Add `PINECONE_API_KEY` and `PINECONE_INDEX` to env.

## Razorpay Setup
1. Create a Razorpay account and generate API keys.
2. Add a webhook endpoint:
   - `https://<your-vercel-domain>/api/payments/webhook`
3. Set webhook secret and add to `RAZORPAY_WEBHOOK_SECRET`.
4. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.

## Cloudinary Setup
1. Create a Cloudinary account.
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

## Vercel Deployment
1. Install Vercel CLI:
   - `npm i -g vercel`
2. Login and deploy:
   - `vercel login`
   - `vercel`
3. In Vercel dashboard, add all environment variables from `.env.example`.
4. Trigger a production deployment:
   - `vercel --prod`

## Pricing Configuration
- `NEXT_PUBLIC_SUBSCRIPTION_PRICE` (paise)
- `NEXT_PUBLIC_HOSTING_FEE_THRESHOLD`
- `NEXT_PUBLIC_HOSTING_FEE_AMOUNT` (paise)
- `NEXT_PUBLIC_PROMOTION_PRICE` (paise)
