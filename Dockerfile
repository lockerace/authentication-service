
FROM node:13.3.0 AS nodeNpm
COPY package.json package-lock.json ./
RUN npm install
FROM node:alpine
COPY --from=nodeNpm node_modules node_modules 
ENV PORT=9000
RUN mkdir /app
WORKDIR /app
COPY . .
EXPOSE $PORT
ENTRYPOINT npm start
