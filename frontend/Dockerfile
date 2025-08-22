# Stage 1: Build the application
FROM node:20 AS builder
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider

# 1. Copy package files FIRST to leverage caching
COPY package*.json ./

# 2. Install dependencies. This layer will be cached.
RUN npm install

# 3. THEN, copy the rest of your source code
COPY . .

# 4. Build the project
RUN npm run build

# Stage 2: Serve the application
FROM node:20
WORKDIR /app

# Copy only the necessary build artifacts from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
