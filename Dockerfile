# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument for environment (dev or prod)
ARG BUILD_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build Angular application based on BUILD_ENV
RUN if [ "$BUILD_ENV" = "dev" ]; then \
      npm run build -- --configuration dev; \
    else \
      npm run build -- --configuration production; \
    fi

# Stage 2: Production
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist/pay-service-frontend/browser /usr/share/nginx/html

# Copy nginx configuration for Angular SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

