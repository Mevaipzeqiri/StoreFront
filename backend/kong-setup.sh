#!/bin/bash

echo "================================"
echo "  Kong API Gateway Setup"
echo "================================"

KONG_ADMIN="http://localhost:8001"
BACKEND_URL="http://backend:3000"

echo "Waiting for Kong to be ready..."
until curl -s ${KONG_ADMIN}/status > /dev/null; do
    echo "Kong is unavailable - sleeping"
    sleep 2
done
echo "✓ Kong is ready!"

echo ""
echo "Creating Kong service..."
curl -i -X POST ${KONG_ADMIN}/services \
  --data name=webstore-api \
  --data url=${BACKEND_URL}

echo ""
echo "Creating Kong route with strip_path=false..."
curl -i -X POST ${KONG_ADMIN}/services/webstore-api/routes \
  --data 'paths[]=/api' \
  --data 'strip_path=false' \
  --data name=webstore-route

echo ""
echo "Enabling rate limiting (100 requests/minute)..."
curl -i -X POST ${KONG_ADMIN}/services/webstore-api/plugins \
  --data name=rate-limiting \
  --data config.minute=100 \
  --data config.policy=local

echo ""
echo "Enabling CORS..."
curl -i -X POST ${KONG_ADMIN}/services/webstore-api/plugins \
  --data name=cors \
  --data 'config.origins=*' \
  --data 'config.methods[]=GET' \
  --data 'config.methods[]=POST' \
  --data 'config.methods[]=PUT' \
  --data 'config.methods[]=DELETE' \
  --data 'config.methods[]=PATCH' \
  --data 'config.methods[]=OPTIONS' \
  --data 'config.headers[]=Accept' \
  --data 'config.headers[]=Authorization' \
  --data 'config.headers[]=Content-Type' \
  --data 'config.credentials=true'

echo ""
echo "Enabling request transformer..."
curl -i -X POST ${KONG_ADMIN}/services/webstore-api/plugins \
  --data name=request-transformer \
  --data 'config.add.headers[]=X-Gateway:Kong'

echo ""
echo "Enabling Prometheus plugin..."
curl -i -X POST ${KONG_ADMIN}/plugins \
  --data name=prometheus

echo ""
echo "================================"
echo "  Kong Setup Complete!"
echo "================================"
echo ""
echo "Verifying configuration..."
curl -s ${KONG_ADMIN}/services/webstore-api | jq '{name, url, id}'
echo ""
curl -s ${KONG_ADMIN}/routes | jq '.data[] | {name, paths, strip_path}'
echo ""
echo "Access your API through Kong:"
echo "  http://localhost:8000/api/v1/products"
echo ""
echo "Test backend connectivity (from host):"
echo "  curl http://localhost:3000/api/v1/products"
