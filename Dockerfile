FROM python:3.11-slim AS backend
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM node:20-slim AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN npm install --legacy-peer-deps
COPY frontend .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY --from=backend /app /app
COPY --from=frontend /frontend/dist /app/static
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
