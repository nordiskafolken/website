for f in ../ocr/book-1/*.txt; do
  npm run inject-tag-numbers $f
done
