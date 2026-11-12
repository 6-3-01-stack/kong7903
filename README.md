# README

This repository contains a starter for a multi-AI web app with nickname/password login.

## Setup

1. Install dependencies:
   npm install
2. Create the database:
   npx prisma migrate dev --name init
3. Run the app:
   npm run dev

## Environment

Copy `.env.example` to `.env` and fill in secrets.

## Notes

- The project currently includes login and a dashboard shell.
- AI generation endpoints are ready for extension with OpenAI or other model providers.
