FROM python:alpine

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]  