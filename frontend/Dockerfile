FROM node:18-alpine AS builder

WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build



# Serve using Next.js built-in server
EXPOSE 3000
CMD ["npm", "start"]