for file in resources/js/pages/admin/*.tsx; do
  echo "--- $file ---"
  grep -E "useState\(|axios|api\.|fetch\(" "$file"
done
