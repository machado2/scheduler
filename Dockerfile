FROM rust AS builder
COPY api .
RUN cargo build --release

FROM node as node
WORKDIR /usr/src/app
COPY scheduler/package*.json ./
RUN npm install
COPY scheduler/ .
RUN npm run build

FROM debian:buster-slim
RUN mkdir -p /scheduler/dist
COPY --from=builder ./target/release/scheduler /scheduler
COPY --from=node /usr/src/app/dist/scheduler /scheduler/dist
EXPOSE 8080
CMD ["/scheduler/scheduler"]