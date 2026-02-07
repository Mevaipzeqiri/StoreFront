#!/bin/bash

echo "================================"
echo "  Kong Complete Cleanup"
echo "================================"

KONG_ADMIN="http://localhost:8001"

# Delete all plugins
echo "Deleting all plugins..."
for plugin_id in $(curl -s ${KONG_ADMIN}/plugins | jq -r '.data[].id'); do
    echo "Deleting plugin: $plugin_id"
    curl -s -X DELETE ${KONG_ADMIN}/plugins/$plugin_id
done

# Delete all routes
echo "Deleting all routes..."
for route_id in $(curl -s ${KONG_ADMIN}/routes | jq -r '.data[].id'); do
    echo "Deleting route: $route_id"
    curl -s -X DELETE ${KONG_ADMIN}/routes/$route_id
done

# Delete all services
echo "Deleting all services..."
for service_id in $(curl -s ${KONG_ADMIN}/services | jq -r '.data[].id'); do
    echo "Deleting service: $service_id"
    curl -s -X DELETE ${KONG_ADMIN}/services/$service_id
done

echo ""
echo "✓ Cleanup complete!"
echo ""
