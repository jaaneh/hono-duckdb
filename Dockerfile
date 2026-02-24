# Use the official Bun image
FROM oven/bun:latest

# Install necessary system libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    make \
    python3 \
    python3-pip \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb (if you have one)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy the rest of your application
COPY . .

ENV PYTHON=/usr/bin/python3

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "src/index.ts"]

# Expose the port
EXPOSE 3000