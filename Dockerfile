# Use a Node.js Alpine image for smaller size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application
COPY . .

EXPOSE 5030

# Start the backend
CMD ["npm", "run","dev"]
