# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY backend/ .

# Expose port for the backend
EXPOSE 8080

# Start the backend server
CMD ["npm", "start"]
