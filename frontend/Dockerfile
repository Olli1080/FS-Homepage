FROM node:18.15-buster-slim

RUN apt-get update && apt-get -y install --no-install-recommends \
  unzip \
  bzip2 && \
  apt-get -y autoremove && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /var/vuecms
WORKDIR /var/vuecms

COPY . .

RUN npm i

EXPOSE 5000

RUN chown -R node:node /var/vuecms
USER node

ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build
CMD ["npm", "run", "start:prod"]
