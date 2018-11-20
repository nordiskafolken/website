for f in ../ocr/book-1/*.txt; do
  npm run rewrite-notes $f
done
