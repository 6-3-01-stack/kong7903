# AI Studio Starter

This repository contains a starter app for a multi-AI web product with nickname/password login.

## Features

- Nickname + password signup/login
- AI feature dashboard shell
- Chat / knowledge API
- Code generation API
- Image generation API

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Create the database
   ```bash
   npx prisma migrate dev --name init
   ```
3. Add environment variables
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `OPENAI_API_KEY` and a long JWT secret.
4. Run the app
   ```bash
   npm run dev
   ```

## Notes

- `app/api/chat/route.ts` calls OpenAI Chat Completions.
- `app/api/code/route.ts` calls the same model for coding tasks.
- `app/api/image/route.ts` calls OpenAI image generation.
- You will need a valid OpenAI API key to activate the AI features.

## Local access

Open the app at:

```text
http://localhost:3000
```
