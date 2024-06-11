FROM ccr.ccs.tencentyun.com/ystest/xf-node:v18.9.0-pnpm as build-stage

MAINTAINER xf <1182900548@qq.com>

npm install -g bun

WORKDIR /www/firey-ci/firey

COPY . .

RUN chmod +x /www/firey-ci/firey/entrypoint.sh

ENTRYPOINT ["/www/firey-ci/firey/entrypoint.sh"]