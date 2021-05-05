#############################
# █░█ █▀█ █▀▄ ▄▀█ ▀█▀ █▀▀ ▄▄ █▀ █▀▀ █▀█ █ █▀█ ▀█▀ █▀
# █▄█ █▀▀ █▄▀ █▀█ ░█░ ██▄ ░░ ▄█ █▄▄ █▀▄ █ █▀▀ ░█░ ▄█
#############################
# How to update holochain?
# make HC_REV="HC_REV" update-hc
# Example use: make HC_REV="78e2591449f1467f32b24219b4ffac75b6b840ee" update-hc

# The reason this is broken into 3 commands is because
# in the update-nix-by-failure will fail with exit code 102
# and breaking it into 3 commands helps handle the error
update-hc:
	make HC_REV=$(HC_REV) update-hc-sha
	make HC_REV=$(HC_REV) update-nix-by-failure
	make HC_REV=$(HC_REV) update-hc-cargoSha
	echo '⚙️  Creting new branch for release...'
	git checkout -b update-hc-$(HC_REV)
	git add overlays/holo-nixpkgs/holochain/
	git commit -m overlays/holo-nixpkgs/holochain/version:hpos-rev:$(HC_REV)
	git push origin HEAD

update-hc-sha:
	@if [ $(HC_REV) ]; then\
		echo "⚙️  Updating servicelogger using holochain rev: $(HC_REV)";\
		echo "✔  Updating hdk rev in Cargo.toml...";\
		echo "✔  Replacing rev...";\
		sed -i '3s/.*/    rev = "$(HC_REV)";/' overlays/holo-nixpkgs/holochain/versions.nix;\
		echo "✔  Replacing sha256...";\
		sed -i '4s/.*/    sha256 = "$(shell nix-prefetch-url --unpack "https://github.com/holochain/holochain/archive/$(HC_REV).tar.gz")";/' overlays/holo-nixpkgs/holochain/versions.nix;\
	else \
		echo "No holochain rev provided"; \
  fi

update-nix-by-failure:
	@if [ $(HC_REV) ]; then\
		echo "➳  Corrupting cargoSha256...";\
		sed -i '5s/.*/    cargoSha256 = "000000000000000000000000000000000000000000000000000a";/' overlays/holo-nixpkgs/holochain/versions.nix;\
		echo "➳  Getting cargoSha256... This can take a while...";\
		nix-build -A holochain > nix.log 2>&1 || echo "This was ment to fail :)...";\
	else \
		echo "No holochain rev provided"; \
  fi

update-hc-cargoSha:
	@if [ $(HC_REV) ]; then\
		echo "➳  Waiting for 5s..."$*;\
		sleep 5;\
		echo "✔  Replacing cargoSha256...";\
		$(eval CARGOSHA256=$(shell sh -c "grep "got" ./nix.log" | awk '{print $$2}'))\
		sed -i '5s/.*/    cargoSha256 = "$(CARGOSHA256)";/' overlays/holo-nixpkgs/holochain/versions.nix;\
	else \
		echo "No holochain rev provided"; \
  fi
