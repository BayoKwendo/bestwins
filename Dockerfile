FROM node:16

WORKDIR /app/

COPY package.json ./

COPY build /build 
COPY node_modules /node_modules 
# RUN npm uninstall node-sass

# RUN npm i sass-loader@latest

RUN npm install -g serve@13.0.4


# RUN  npm install --legacy-peer-dep

# CMD serve -s build
# CMD ["npm", "start"]
CMD ["npx", "serve", "-s", "build", "-p", "1616"]