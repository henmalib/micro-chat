#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
cd $SCRIPT_DIR/../

mkdir -p $SCRIPT_DIR/../shared/grpc/dist
# TODO: configure it, so it would work without installing global pcakges
# npm install --global ts-protoc-gen protoc-gen-js
protoc --js_out=import_style=commonjs,binary:$SCRIPT_DIR/../shared/grpc/dist \
    --ts_out=service=grpc-node,mode=grpc-js:$SCRIPT_DIR/../shared/grpc/dist \
    --grpc_out=grpc_js:$SCRIPT_DIR/../shared/grpc/dist \
    --plugin=protoc-gen-grpc=$(pnpm bin)/grpc_tools_node_protoc_plugin \
    --proto_path=$SCRIPT_DIR/../shared/grpc/internal \
    $(find $SCRIPT_DIR/../shared/grpc/internal -iname "*.proto")