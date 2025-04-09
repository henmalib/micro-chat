#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $(realpath -s $0))
cd $SCRIPT_DIR/../

mkdir -p $SCRIPT_DIR/dist
DIST_PATH=$SCRIPT_DIR/dist

# Will work only when runned with pnpm build
protoc --plugin=protoc-gen-grpc=$(which grpc_tools_node_protoc_plugin) \
    --js_out=import_style=commonjs,binary:$DIST_PATH \
    --ts_out=service=grpc-node,mode=grpc-js:$DIST_PATH \
    --grpc_out=grpc_js:$DIST_PATH \
    --plugin=protoc-gen-ts=$(which protoc-gen-ts) \
    --plugin=protoc-gen-js=$(which protoc-gen-js) \
    --proto_path=$SCRIPT_DIR/internal \
    $(find $SCRIPT_DIR/internal -iname "*.proto")
