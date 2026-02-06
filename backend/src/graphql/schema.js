const gql = require('graphql-tag');

const typeDefs = gql`
  type Query {
    products(page: Int, limit: Int, is_active: Boolean): ProductsResponse
    product(id: Int!): Product
    searchProducts(
      search: String
      gender: String
      category: String
      brand: String
      color: String
      size: String
      price_min: Float
      price_max: Float
      availability: String
      page: Int
      limit: Int
    ): ProductsResponse
    categories: [Category]
    brands: [Brand]
    colors: [Color]
    sizes: [Size]
    genders: [Gender]
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product
    updateProduct(id: Int!, input: UpdateProductInput!): Product
    deleteProduct(id: Int!): DeleteResponse
    updateProductStock(id: Int!, quantity: Int!): Product
  }

  type Subscription {
    productCreated: Product
    productUpdated: Product
    productDeleted: Int
    stockUpdated: StockUpdate
  }

  type Product {
    id: Int!
    name: String!
    description: String
    price: Float!
    quantity: Int!
    current_quantity: Int
    category_id: Int
    category_name: String
    brand_id: Int
    brand_name: String
    gender_id: Int
    gender_name: String
    color_id: Int
    color_name: String
    size_id: Int
    size_name: String
    image_url: String
    is_active: Boolean!
    created_at: String
    updated_at: String
  }

  type ProductsResponse {
    data: [Product]
    pagination: Pagination
    filters: Filters
  }

  type Pagination {
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type Filters {
    gender: String
    category: String
    brand: String
    color: String
    size: String
    price_min: Float
    price_max: Float
    availability: String
    search: String
  }

  type Category {
    id: Int!
    name: String!
    description: String
    created_at: String
    updated_at: String
  }

  type Brand {
    id: Int!
    name: String!
    description: String
    created_at: String
    updated_at: String
  }

  type Color {
    id: Int!
    name: String!
    hex_code: String
    created_at: String
  }

  type Size {
    id: Int!
    name: String!
    description: String
    sort_order: Int
    created_at: String
  }

  type Gender {
    id: Int!
    name: String!
    description: String
    created_at: String
  }

  type StockUpdate {
    product_id: Int!
    product_name: String!
    old_quantity: Int!
    new_quantity: Int!
    updated_at: String!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  input CreateProductInput {
    name: String!
    description: String
    price: Float!
    quantity: Int!
    category_id: Int
    brand_id: Int
    gender_id: Int
    color_id: Int
    size_id: Int
    image_url: String
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    quantity: Int
    category_id: Int
    brand_id: Int
    gender_id: Int
    color_id: Int
    size_id: Int
    image_url: String
    is_active: Boolean
  }
`;

module.exports = typeDefs;