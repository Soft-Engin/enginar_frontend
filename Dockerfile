# Build stage
FROM node:22-alpine as build

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY .env.example ./.env

RUN sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=${VITE_API_BASE_URL}|" .env

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
