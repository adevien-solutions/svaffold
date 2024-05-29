import { Subfolder } from '../types.js';

export function getDockerfileContent(): string {
	return `FROM node:16.17-alpine AS builder

# Get the project argument
ARG project

RUN npm install -g pnpm@7.18.1

# Setup workspace
WORKDIR /client
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .dockerignore .gitignore .npmrc ./
COPY ./${Subfolder.shared} ./${Subfolder.shared}
COPY ./${Subfolder.projects}/$project ./${Subfolder.projects}/$project
RUN pnpm install --frozen-lockfile

# Turborepo fails to run build on alpine without this
RUN apk add --no-cache libc6-compat

# Build the app
ENV NODE_ENV=production
RUN pnpm build:$project

# Start new step
FROM --platform=linux/amd64 node:16.17-alpine AS deployment

ARG project

# Copy over only the build folder from the first step
WORKDIR /app
COPY --from=builder /client/sites/$project/build .
ENV NODE_ENV=production
RUN printf '{\\n  "type": "module"\\n}' > package.json

ENV PORT=80
EXPOSE 80
CMD ["node", "."]
`;
}
