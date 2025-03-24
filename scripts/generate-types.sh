#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

pnpm proto-loader-gen-types \
    --longs=String \
    --enums=String \
    --defaults \
    --oneofs \
    --grpcLib=@grpc/grpc-js \
    --outDir=$SCRIPT_DIR/../shared/grpc/proto \
    $SCRIPT_DIR/../shared/grpc/rpc/*.proto

pnpm exec grpc_tools_node_protoc \
    --plugin=$(pnpm bin)/protoc-gen-ts \
    --js_out=import_style=commonjs,binary:$SCRIPT_DIR/../shared/grpc/proto \
    --proto_path=$SCRIPT_DIR/../shared/grpc/rpc \
    $SCRIPT_DIR/../shared/grpc/rpc/*.proto
