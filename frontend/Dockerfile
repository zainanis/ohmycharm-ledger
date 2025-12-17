# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies (faster & deterministic)
RUN npm ci --silent

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with "serve"
FROM node:20-alpine AS production

WORKDIR /app

# Install 'serve' globally
RUN npm install -g serve --silent

# Copy build artifacts from previous stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]
