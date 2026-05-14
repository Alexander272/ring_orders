FROM node:25-alpine3.23 AS frontend
WORKDIR /build
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ .
RUN yarn build

FROM golang:1.25-alpine3.23 AS builder
WORKDIR /build
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
COPY --from=frontend /build/dist ./web/frontend
RUN go build -o main cmd/app/main.go

FROM alpine:3.23.4
RUN apk add --no-cache tzdata
COPY --from=builder /build/configs/ /configs/
COPY --from=builder /build/main /bin/main
ENTRYPOINT ["/bin/main"]
