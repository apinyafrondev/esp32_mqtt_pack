# Use the official Node.js image as the base image
FROM node:20.16.0-bookworm

# Install PM2 globally
RUN npm install pm2 -g

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
