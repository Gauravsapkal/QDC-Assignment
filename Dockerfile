FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN npm install --workspaces

COPY . .

RUN npm run build --workspace server && npm run build --workspace client

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
