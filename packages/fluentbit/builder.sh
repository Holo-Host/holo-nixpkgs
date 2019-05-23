source "$stdenv"/setup
pwd
cp --recursive "$src" ./

chmod --recursive u=rwx ./"$(basename "$src")"

cd ./"$(basename "$src")"/build

pwd && ls -la && cmake ../ && make

mkdir --parents "$out"
cp --recursive ./bin "$out"