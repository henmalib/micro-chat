{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    pnpm_10
    nodejs_23
    protobuf
    grpc-tools
    protoc-gen-js
    gcc
    nix-ld
    lefthook
  ];

  NIX_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
    pkgs.stdenv.cc.cc
  ];

  shellHook = ''
    export LD_LIBRARY_PATH=$NIX_LD_LIBRARY_PATH:$LD_LIBRARY_PATH

    if [ ! -f .env ]
    then
      export $(cat .env | xargs)
    fi

    set -a && source .env && set +a
    lefthook install
  '';
}
