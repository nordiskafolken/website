rm ./build/*.html

for f in ./src/*.txt; do
  npm run chapter $f
done
