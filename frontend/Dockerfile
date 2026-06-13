FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/app.conf /etc/nginx/conf.d/app.conf

EXPOSE 8080
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
