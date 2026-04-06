# Use the official Bun image
FROM oven/bun:latest as base
WORKDIR /usr/src/app

# Install yt-dlp dependencies (Python, FFmpeg) and download yt-dlp
RUN apt-get update && apt-get install -y python3 ffmpeg curl && rm -rf /var/lib/apt/lists/* && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
# Copying package.json and bun.lock
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy node_modules and all project files
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Set production environment
ENV NODE_ENV=production

# Run the app directly via Bun (using the entrypoint from your dev script)
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
