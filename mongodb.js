// ============================================================
// MEMBUAT COLLECTION
// SQL: CREATE TABLE customers (...);
// ============================================================
db.createCollection("customers");

// SQL: CREATE TABLE products (...);
db.createCollection("products");

// SQL: CREATE TABLE orders (...);
db.createCollection("orders");

// SQL: SHOW TABLES;
db.getCollectionNames();

// ============================================================
// MEMBACA SEMUA DATA
// SQL: SELECT * FROM customers;
// ============================================================
db.customers.find();

// ============================================================
// INSERT SATU DATA
// SQL: INSERT INTO customers (_id, name) VALUES ('elham', 'M Elham Abdussalam');
// ============================================================
db.customers.insertOne({
  _id: "elham",
  name: "M Elham Abdussalam",
});

// ============================================================
// INSERT BANYAK DATA SEKALIGUS
// SQL: INSERT INTO products (_id, name, price) VALUES
//      (1, 'Indomie Ayam Bawang', 2000),
//      (2, 'Mie Sedap Soto', 2000);
// ============================================================
db.products.insertMany([
  {
    _id: 1,
    name: "Indomie Ayam Bawang",
    price: new NumberLong("2000"),
  },
  {
    _id: 2,
    name: "Mie Sedap Soto",
    price: new NumberLong("2000"),
  },
]);

// ============================================================
// INSERT DATA DENGAN NESTED / EMBEDDED DOCUMENT
// SQL: -- Tidak ada padanan langsung di SQL (biasanya pakai JOIN)
//      INSERT INTO orders (_id, total) VALUES (..., 8000);
//      INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (...);
// ============================================================
db.orders.insertOne({
  _id: new ObjectId(),
  total: new NumberLong("8000"),
  items: [
    {
      product_id: 1,
      price: new NumberLong("2000"),
      quantity: new NumberInt("2"),
    },
    {
      product_id: 2,
      price: new NumberLong("2000"),
      quantity: new NumberInt("2"),
    },
  ],
});

// ============================================================
// QUERY BERDASARKAN PRIMARY KEY / _id
// SQL: SELECT * FROM customers WHERE _id = 'elham';
// ============================================================
db.customers.find({
  _id: "elham",
});

// ============================================================
// QUERY BERDASARKAN KOLOM BIASA
// SQL: SELECT * FROM customers WHERE name = 'M Elham Abdussalam';
// ============================================================
db.customers.find({
  name: "M Elham Abdussalam",
});

// ============================================================
// QUERY BERDASARKAN NILAI ANGKA
// SQL: SELECT * FROM products WHERE price = 2000;
// ============================================================
db.products.find({
  price: 2000,
});

// ============================================================
// QUERY NESTED FIELD (dot notation)
// SQL: SELECT o.* FROM orders o
//      JOIN order_items i ON o._id = i.order_id
//      WHERE i.product_id = 1;
// ============================================================
db.orders.find({
  "items.product_id": 1,
});

// ============================================================
// INSERT DENGAN FIELD TAMBAHAN (schema flexible / schemaless)
// SQL: -- Di SQL kolom harus didefinisikan dulu di DDL
//      ALTER TABLE products ADD COLUMN category VARCHAR(50);
//      INSERT INTO products ...;
// ============================================================
db.products.insertMany([
  {
    _id: 3,
    name: "Pop Mie Rasa Bakso",
    price: new NumberLong("2500"),
    category: "food",
  },
  {
    _id: 4,
    name: "Samsung Galaxy S10",
    price: new NumberLong("10000000"),
    category: "handphone",
  },
  {
    _id: 5,
    name: "Acer Predator Helios 300",
    price: new NumberLong("20000000"),
    category: "laptop",
  },
]);

// ============================================================
// OPERATOR $eq — sama dengan (=)
// SQL: SELECT * FROM customers WHERE _id = 'elham';
// ============================================================
db.customers.find({
  _id: {
    $eq: "elham",
  },
});

// ============================================================
// OPERATOR $gt — lebih besar dari (>)
// SQL: SELECT * FROM products WHERE price > 2000;
// ============================================================
db.products.find({
  price: {
    $gt: 2000,
  },
});

// ============================================================
// OPERATOR $in + $gt — filter ganda implisit (AND)
// SQL: SELECT * FROM products
//      WHERE category IN ('laptop', 'handphone')
//      AND price > 10000000;
// ============================================================
db.products.find({
  category: {
    $in: ["laptop", "handphone"],
  },
  price: {
    $gt: 10000000,
  },
});

// ============================================================
// OPERATOR $and — AND eksplisit
// SQL: SELECT * FROM products
//      WHERE category IN ('laptop', 'handphone')
//      AND price > 10000000;
// ============================================================
db.products.find({
  $and: [
    {
      category: {
        $in: ["laptop", "handphone"],
      },
    },
    {
      price: {
        $gt: 10000000,
      },
    },
  ],
});

// ============================================================
// OPERATOR $not + $in — NOT IN
// SQL: SELECT * FROM products
//      WHERE category NOT IN ('laptop', 'handphone');
// ============================================================
db.products.find({
  category: {
    $not: {
      $in: ["laptop", "handphone"],
    },
  },
});

// ============================================================
// OPERATOR $exists: true — field harus ADA
// SQL: SELECT * FROM products WHERE category IS NOT NULL;
// ============================================================
db.products.find({
  category: {
    $exists: true,
  },
});

// ============================================================
// OPERATOR $exists: false — field TIDAK ADA
// SQL: SELECT * FROM products WHERE category IS NULL;
// ============================================================
db.products.find({
  category: {
    $exists: false,
  },
});

// ============================================================
// OPERATOR $type — filter berdasarkan tipe data field
// SQL: -- Tidak ada padanan langsung di SQL (tipe sudah fixed)
//      SELECT * FROM products WHERE typeof(category) = 'string';
// ============================================================
db.products.find({
  category: {
    $type: "string",
  },
});

// ============================================================
// OPERATOR $type dengan multiple tipe — OR tipe data
// SQL: -- Tidak ada padanan langsung di SQL
//      SELECT * FROM products WHERE typeof(price) IN ('int', 'long');
// ============================================================
db.products.find({
  price: {
    $type: ["int", "long"],
  },
});

db.customers.insertOne({
  _id: "joko",
  name: "joko",
});

db.customers.find({
  $expr: {
    $eq: ["$_id", "$name"],
  },
});

db.products.find({
  $jsonSchema: {
    required: ["name", "category"],
  },
});

db.products.find({
  $jsonSchema: {
    required: ["name"],
    properties: {
      name: {
        type: "string",
      },
      price: {
        type: "number",
      },
    },
  },
});

db.products.find({
  price: {
    $mod: [5, 0],
  },
});

db.products.find({
  price: {
    $mod: [1000000, 0],
  },
});

db.products.find({
  name: {
    $regex: /mie/,
    $options: "i",
  },
});

db.products.find({
  name: {
    $regex: /^Mie/,
  },
});

db.customers.find({
  $where: function () {
    return this._id == this.name;
  },
});
