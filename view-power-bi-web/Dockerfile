# Usa una imagen base de Node.js para construir la aplicación de Angular
FROM node:18.16.0 AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Instala las dependencias del proyecto
RUN npm install
RUN npm install -g @angular/cli

# Copia el resto del código fuente al directorio de trabajo
COPY ./src ./src

# Compila la aplicación de Angular
RUN ng build --configuration production --aot

# Usa una imagen base de Nginx para el entorno de producción
FROM nginx:latest

# Copia los archivos compilados de la aplicación de Angular al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Elimina la configuración de Nginx por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu archivo de configuración personalizada de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto en el que se ejecuta Nginx (por defecto, el puerto 80)
EXPOSE 80

# Inicia Nginx al iniciar el contenedor
CMD ["nginx", "-g", "daemon off;"]
