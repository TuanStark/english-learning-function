# ---- Build Stage ----
    FROM node:18-alpine AS build

    WORKDIR /usr/src/app
    
    COPY package*.json ./
    
    # Cài dependencies (bao gồm dev)
    RUN npm install
    
    # Copy toàn bộ source code
    COPY . .
    
    # Build ứng dụng (NestJS, NextJS, ...)
    RUN npm run build
    
    # ---- Production Stage ----
    FROM node:18-alpine AS production
    
    WORKDIR /usr/src/app
    
    # Copy package.json để cài production deps
    COPY package*.json ./
    
    # Cài dependencies production
    RUN npm install --only=production
    
    # Copy dist đã build từ stage build
    COPY --from=build /usr/src/app/dist ./dist
    
    # Copy schema Prisma (cần thiết cho prisma client)
    COPY --from=build /usr/src/app/prisma ./prisma
    
    # Copy mail templates
    COPY --from=build /usr/src/app/src/common/mail ./src/common/mail
    
    # Generate prisma client trong production
    RUN npx prisma generate
    
    # Nếu bạn muốn migrate khi container khởi động:
    # CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
    
    CMD ["node", "dist/main.js"]
    