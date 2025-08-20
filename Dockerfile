# Base image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Bundle the rest of app source
COPY . .

# Build the application
RUN yarn build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
