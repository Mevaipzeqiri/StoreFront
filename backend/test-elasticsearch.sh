#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        Elasticsearch Advanced Query Examples                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:3000/api/v1/search"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  BASIC FULL-TEXT SEARCH"
echo "   Query: Search for 'running shoes'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}?q=running%20shoes&limit=5" | jq '{
  total: .pagination.total,
  products: .data | map({
    name: .name,
    price: .price,
    brand: .brand_name,
    category: .category_name,
    score: ._score
  })
}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  FILTERED SEARCH WITH MULTIPLE CRITERIA"
echo "   Query: Nike products under $100, in stock, sorted by price"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}?brand=Nike&price_max=100&in_stock=true&sort_by=price_asc&limit=5" | jq '{
  total: .pagination.total,
  filters: .query,
  products: .data | map({
    name: .name,
    price: .price,
    stock: .current_quantity,
    brand: .brand_name
  })
}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  FACETED SEARCH WITH AGGREGATIONS"
echo "   Query: Search 'jacket' with category and price range aggregations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}?q=jacket" | jq '{
  total: .pagination.total,
  products: .data | map({name: .name, price: .price}),
  facets: {
    categories: .facets.categories | map({category: .key, count: .doc_count}),
    price_ranges: .facets.price_ranges | map({range: .key, count: .doc_count})
  }
}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  COMPLEX MULTI-FILTER SEARCH"
echo "   Query: Women's sportswear, Adidas, price $40-$100, size M"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}?q=sportswear&gender=Women&brand=Adidas&category=Sportswear&price_min=40&price_max=100&size=M&sort_by=relevance" | jq '{
  total: .pagination.total,
  applied_filters: .query,
  products: .data | map({
    name: .name,
    price: .price,
    brand: .brand_name,
    gender: .gender_name,
    size: .size_name,
    score: ._score
  })
}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  FUZZY SEARCH (TYPO TOLERANCE)"
echo "   Query: 'jens' (typo for 'jeans') with fuzzy matching"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}?q=jens&limit=5" | jq '{
  total: .pagination.total,
  note: "Fuzzy matching enabled - found results despite typo",
  products: .data | map({
    name: .name,
    price: .price,
    match_score: ._score
  })
}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  AUTOCOMPLETE SUGGESTIONS"
echo "   Query: 'nik' (partial search)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/autocomplete?q=nik" | jq '{
  suggestions: .data | map({
    name: .name,
    price: .price,
    brand: .brand_name
  })
}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  CATEGORY BROWSING WITH PAGINATION"
echo "   Query: All shoes, sorted by newest, page 1"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}?category=Shoes&sort_by=newest&page=1&limit=3" | jq '{
  pagination: .pagination,
  products: .data | map({
    name: .name,
    price: .price,
    brand: .brand_name,
    created_at: .created_at
  })
}'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8️⃣  INDEX STATISTICS"
echo "   Get Elasticsearch index health and statistics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/stats" | jq '.'
echo ""
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  ✅ All Tests Complete                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"