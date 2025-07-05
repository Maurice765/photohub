# Photohub

## Backend:

Navigate to the Backend Directory:
```bash
cd backend
```

Configure Environment Variables:
```bash
touch .env
```
Add the following content to `.env`:
```bash
ORACLE_USER=your_oracle_username
ORACLE_PASSWORD=your_oracle_password
ORACLE_DSN=your_oracle_dsn_string
```

Install Dependencies:
```bash
uv sync --all-extras
```

Start the FastAPI Server:
```bash
uv run uvicorn src.main:app --reload
```

## Frontend:

Angular starten:

```bash
cd frontend
```

```bash
npm start
```