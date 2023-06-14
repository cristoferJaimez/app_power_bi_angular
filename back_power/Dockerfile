# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json a la imagen
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente al directorio de trabajo
COPY . .

# Expone el puerto en el que se ejecuta la aplicación (por ejemplo, el puerto 3000)
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["node", "app/app.js"]
