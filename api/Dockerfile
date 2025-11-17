FROM node:20-alpine

# Instalar dependências nativas necessárias para o Prisma

WORKDIR /api

# Copiar package.json e package-lock.json (ou yarn.lock)
COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Gerar cliente Prisma na build para evitar gerar em runtime
RUN npx prisma generate
RUN npm run build

EXPOSE 3333

# Rodar a aplicação (ajuste se usa typescript ou outro start script)
CMD ["npm", "run", "start:dev"]
