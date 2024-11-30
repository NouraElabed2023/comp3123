# Use official Node.js image for building the React app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the app and build the production version
COPY frontend/ ./
RUN npm run build

# Use nginx to serve the build output
FROM nginx:alpine

# Copy the build output to nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
