rm ./src/*.txt

for f in ../ocr/book-1/formatted/*.txt; do
  npm run reformat $f
done
