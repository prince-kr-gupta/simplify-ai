# Simplify AI

A tiny open-model study buddy built for a friend who keeps saying:
**"Make difficult topics simple."**

## What it does
Paste any study topic or notes, choose:
- Beginner / Normal / Exam Tomorrow
- English / Hinglish
- Explain / Short Notes / Quiz / Viva

The backend sends the request to a hosted **open-weight model** through Hugging Face Inference Providers.

## Stack
- React + Vite
- Node.js + Express
- Hugging Face Inference Providers
- Open-weight LLM
- Ready for Vercel (frontend) + Render (backend)

## 1. Get a Hugging Face token
Create a Hugging Face account and generate an access token.

## 2. Backend
```bash
cd backend
npm install
```

Copy `.env.example` to `.env`:

```env
HF_TOKEN=hf_your_token_here
MODEL_ID=Qwen/Qwen2.5-7B-Instruct
PORT=5000
```

Then:
```bash
npm run dev
```

> Want to target the Gemma category? After you have access to the Gemma model on Hugging Face, change `MODEL_ID` to `google/gemma-2-2b-it`.

## 3. Frontend
Open a second terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then:
```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## Deploy
### Render backend
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `HF_TOKEN`
  - `MODEL_ID`

### Vercel frontend
- Root directory: `frontend`
- Build command: `npm run build`
- Output: `dist`
- Environment variable:
  - `VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com`

## Hackathon story
Built for a real friend who needs difficult college topics explained quickly in simple English/Hinglish.

The open-model angle matters because the model can be swapped, self-hosted later, or run locally without redesigning the app.
