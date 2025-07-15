# Photohub

## Backend:

Navigate to the Backend Directory:
```bash
cd backend
```

Configure Environment Variables:
```bash
cp .env.dist .env
```
Then edit `.env` with your actual Oracle database credentials.

Install Dependencies:
```bash
uv sync --all-extras
```

Start the FastAPI Server:
```bash
uv run uvicorn src.main:app --reload
```

## Frontend:

Navigate to the Frontend Directory:
```bash
cd frontend
```

Install Dependencies:
```bash
npm install
```

Start Angular Project:
```bash
npm run start
```

Generate OpenApi Client:
```bash
npm run generate:api
```