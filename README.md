# Photohub

A photo sharing application with color-based search capabilities, built with FastAPI backend and Angular frontend.

## Documentation

- [Image Fetching Flow Overview](docs/IMAGE_FETCHING_FLOW.md) - Complete analysis of image storage and retrieval
- [Image Flow Sequence Diagrams](docs/IMAGE_FLOW_SEQUENCE.md) - Visual flow diagrams with Mermaid
- [Implementation Guide](docs/IMAGE_IMPLEMENTATION_GUIDE.md) - Technical implementation details

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

Generate OpenApi Client
```bash
npm run generate:api
```