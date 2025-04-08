{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    pnpm_10
    nodejs_23
    protobuf
    grpc-tools
    gcc
    lefthook
  ];

  shellHook = ''
    if [ ! -f .env ]
    then
      export $(cat .env | xargs)
    fi

    set -a && source .env && set +a
    lefthook install
    fish
  '';
}
