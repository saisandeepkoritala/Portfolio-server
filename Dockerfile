# Step 1: Build the TypeScript application
FROM node:24-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install ALL dependencies (including devDependencies like typescript)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Step 2: Run the production application
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies using modern npm flags
RUN npm ci --omit=dev

# Copy compiled JavaScript code from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the internal port (Render defaults to 10000)
EXPOSE 10000

# Start the application
CMD ["npm", "start"]