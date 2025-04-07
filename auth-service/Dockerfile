# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app  # This is where your code will reside in the container

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./ ./

# Build the application
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the app in production mode
CMD ["npm", "run","start"]
