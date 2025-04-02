{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
    pkgs-aarch = nixpkgs.legacyPackages."aarch64-linux";
  in {
    devShells."x86_64-linux".default = import ./shell.nix {inherit pkgs;};
    devShells."aarch64-linux".default = import ./shell.nix {
      pkgs = pkgs-aarch;
    };
  };
}
