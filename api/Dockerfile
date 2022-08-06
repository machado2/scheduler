FROM rust AS builder
COPY . .
RUN cargo build --release

FROM debian:buster-slim
COPY --from=builder ./target/release/scheduler ./target/release/scheduler
EXPOSE 8080
CMD ["/target/release/scheduler"]