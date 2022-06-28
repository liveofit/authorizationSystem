# Sistema de autenticación - segunda entrega Seguridad
Integrantes: Ignacio Barreto, German Rios, Sebastian Olivera, Patricio Zarauz

## Demo

https://user-images.githubusercontent.com/39178332/176276216-207c0cac-0634-4668-b612-c7f6b2695144.mov

## Requisitos

### Development environment

- [Docker >= 20.10.14](https://docs.docker.com/get-docker/)
- [Docker compose >= 1.29.2](https://docs.docker.com/compose/install/)
- [Node.js >= v16.15.1](https://nodejs.org/en/download/)

## Setup local environment

## Para desarrollar en este proyecto 
Se deberan instalar todas dependencias necesarias en las siguientes carpetas: 
- ./services/api
- ./services/dashboard 
En ambos casos ejecutar `npm install` (en caso de tener npm instalado)

Ademas se debera configurar las varaiables de entorno a partir de .env.example creando un nuevo .env file, en la misma ruta. 

Luego de configuradas las variables de entorno, en el directorio raiz del proyecto ejecutar `docker-compose up -d`

Ahora en `http://localhost:<your_api_port>/graphql` (your_api_port en este default env es 4000) puede acceder a la api y en `http://localhost:<your_dashboard_port>` (your_dashboard_port  en este default env es 80)

Puede ir al dahsboard hacer signup y ver su usuario en la base de datos
