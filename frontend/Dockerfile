FROM node:20

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "vite", "--host", "--port", "3000"]