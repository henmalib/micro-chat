#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# TODO: change script default path to project root
# npm install --global ts-protoc-gen protoc-gen-js
protoc --js_out=import_style=commonjs,binary:$SCRIPT_DIR/../shared/grpc/proto \
    --ts_out=service=grpc-node,mode=grpc-js:$SCRIPT_DIR/../shared/grpc/proto \
    --grpc_out=grpc_js:$SCRIPT_DIR/../shared/grpc/proto \
    --plugin=protoc-gen-grpc=$(pnpm bin)/grpc_tools_node_protoc_plugin \
    --proto_path=$SCRIPT_DIR/../shared/grpc/rpc \
    $SCRIPT_DIR/../shared/grpc/rpc/*.proto