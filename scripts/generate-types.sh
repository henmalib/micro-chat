#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $(realpath -s $0))
cd $SCRIPT_DIR/../

PATH=$(pnpm bin):$PATH

mkdir -p $SCRIPT_DIR/../shared/grpc/dist

protoc --plugin=protoc-gen-grpc=$(pnpm bin)/grpc_tools_node_protoc_plugin \
    --js_out=import_style=commonjs,binary:$SCRIPT_DIR/../shared/grpc/dist \
    --ts_out=service=grpc-node,mode=grpc-js:$SCRIPT_DIR/../shared/grpc/dist \
    --grpc_out=grpc_js:$SCRIPT_DIR/../shared/grpc/dist \
    --plugin=protoc-gen-ts=$(pnpm bin)/protoc-gen-ts \
    --plugin=protoc-gen-js=$(pnpm bin)/protoc-gen-js \
    --proto_path=$SCRIPT_DIR/../shared/grpc/internal \
    $(find $SCRIPT_DIR/../shared/grpc/internal -iname "*.proto")
