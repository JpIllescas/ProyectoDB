# Usar la misma imagen estable
FROM python:3.11.7-slim-bullseye

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar requirements.txt
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando para iniciar
CMD ["python", "app.py"]
