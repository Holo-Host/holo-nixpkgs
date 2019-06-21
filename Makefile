SHELL		= bash

.PHONY: all test build install

all: test

# test -- collect up the HoloPortOS source, and use it to execute a nixos-rebuild switch
test:
	HOLOPORT_MODULES_URL=file://$$(		\
	    nix-build -E '				\
		with import <nixpkgs> {};		\
		runCommand "holoportos"			\
		    { src = lib.cleanSource ./.; }	\
		    "					\
			mkdir $$out;			\
			tar caf $$out/holoportos.tar.gz -C $$(dirname $$src) $$(basename $$src) \
		    "					\
		'					\
		--no-out-link				\
	)/holoportos.tar.gz nixos-rebuild switch --show-trace
