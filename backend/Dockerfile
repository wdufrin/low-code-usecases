FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend code (including the populated public directory)
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Cloud Run sets PORT env variable automatically
EXPOSE 3001

CMD [ "node", "server.js" ]
