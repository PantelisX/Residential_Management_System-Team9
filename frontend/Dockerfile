# Στάδιο 1: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=http://localhost:5000
RUN npm run build

# Στάδιο 2: Serve με Nginx
FROM nginx:alpine
# Αντιγράφουμε το δικό μας nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Αντιγράφουμε τα αρχεία του React
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
