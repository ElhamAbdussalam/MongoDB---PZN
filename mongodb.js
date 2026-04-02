// create table customers
db.createCollection("customers");

// create table products
db.createCollection("products");

// create table orders
db.createCollection("orders");

// show tables
db.getCollectionNames();

// select * from customers
db.customers.find();

// insert into customers (_id, name) values ('elham', 'M Elham Abdussalam')
db.customers.insertOne({
  _id: "elham",
  name: "M Elham Abdussalam",
});

// insert into products (_id, name, price) values (1, 'Indomie Ayam Bawang', 2000), (2, 'Mie Sedap Soto', 2000)
db.products.insertMany([
  { _id: 1, name: "Indomie Ayam Bawang", price: new NumberLong("2000") },
  { _id: 2, name: "Mie Sedap Soto", price: new NumberLong("2000") },
]);

// insert into orders (_id, total) values (..., 8000)
// insert into order_items (order_id, product_id, price, quantity) values (...)
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

// select * from customers where _id = 'elham'
db.customers.find({ _id: "elham" });

// select * from customers where name = 'M Elham Abdussalam'
db.customers.find({ name: "M Elham Abdussalam" });

// select * from products where price = 2000
db.products.find({ price: 2000 });

// select * from orders where items.product_id = 1
db.orders.find({ "items.product_id": 1 });

// insert into products (...) values (...) -- schemaless, no alter table needed
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

// select * from customers where _id = 'elham'
db.customers.find({ _id: { $eq: "elham" } });

// select * from products where price > 2000
db.products.find({ price: { $gt: 2000 } });

// select * from products where category in ('laptop', 'handphone') and price > 10000000
db.products.find({
  category: { $in: ["laptop", "handphone"] },
  price: { $gt: 10000000 },
});

// select * from products where category in ('laptop', 'handphone') and price > 10000000
db.products.find({
  $and: [
    { category: { $in: ["laptop", "handphone"] } },
    { price: { $gt: 10000000 } },
  ],
});

// select * from products where category not in ('laptop', 'handphone')
db.products.find({
  category: { $not: { $in: ["laptop", "handphone"] } },
});

// select * from products where category is not null
db.products.find({ category: { $exists: true } });

// select * from products where category is null
db.products.find({ category: { $exists: false } });

// select * from products where typeof(category) = 'string'
db.products.find({ category: { $type: "string" } });

// select * from products where typeof(price) in ('int', 'long')
db.products.find({ price: { $type: ["int", "long"] } });

// insert into customers (_id, name) values ('joko', 'joko')
db.customers.insertOne({ _id: "joko", name: "joko" });

// select * from customers where _id = name
db.customers.find({
  $expr: { $eq: ["$_id", "$name"] },
});

// select * from products where name is not null and category is not null
db.products.find({
  $jsonSchema: { required: ["name", "category"] },
});

// select * from products where name is not null and typeof(name) = 'string' and typeof(price) = 'number'
db.products.find({
  $jsonSchema: {
    required: ["name"],
    properties: {
      name: { type: "string" },
      price: { type: "number" },
    },
  },
});

// select * from products where price % 5 = 0
db.products.find({ price: { $mod: [5, 0] } });

// select * from products where price % 1000000 = 0
db.products.find({ price: { $mod: [1000000, 0] } });

// select * from products where name like '%mie%' (case insensitive)
db.products.find({ name: { $regex: /mie/, $options: "i" } });

// select * from products where name like 'Mie%'
db.products.find({ name: { $regex: /^Mie/ } });

// select * from customers where _id = name
db.customers.find({
  $where: function () {
    return this._id == this.name;
  },
});

// insert into products (...) values (...), (...), (...)
db.products.insertMany([
  {
    _id: 6,
    name: "Logitech Wireless Mouse",
    price: new NumberLong("175000"),
    category: "laptop",
    tags: ["logitech", "mouse", "accessories"],
  },
  {
    _id: 7,
    name: "Coller Pad Gaming",
    price: new NumberLong("200000"),
    category: "laptop",
    tags: ["cooler", "laptop", "accessories", "fan"],
  },
  {
    _id: 8,
    name: "Samsung Curve Monitor",
    price: new NumberLong("1750000"),
    category: "computer",
    tags: ["samsung", "monitor", "computer"],
  },
]);

// select * from products where tags = "samsung" and tags = "monitor"
db.products.find({
  tags: { $all: ["samsung", "monitor"] },
});

// select * from products where tags in ("samsung", "logitech")
db.products.find({
  tags: { $elemMatch: { $in: ["samsung", "logitech"] } },
});

// select * from products where count(tags) = 3
db.products.find({
  tags: { $size: 3 },
});

// select _id, name, category from products
db.products.find({}, { name: 1, category: 1 });

// select _id, name, category, category from products (exclude tags, price)
db.products.find({}, { tags: 0, price: 0 });

// select name, tags (filtered) from products
db.products.find(
  {},
  {
    name: 1,
    tags: {
      $elemMatch: { $in: ["samsung", "logitech", "accessories"] },
    },
  },
);

// select name, tags[first match] from products where tags is not null
db.products.find({ tags: { $exists: true } }, { name: 1, "tags.$": 1 });

// select name, tags[0..1] from products where tags is not null
db.products.find({ tags: { $exists: true } }, { name: 1, tags: { $slice: 2 } });

// select count(*) from products
db.products.find({}).count();

// select * from products limit 4
db.products.find({}).limit(4);

// select * from products limit 4 offset 2
db.products.find({}).limit(4).skip(2);

// select * from products order by category asc, name desc
db.products.find({}).sort({ category: 1, name: -1 });

// update products set category = 'food' where _id = 1
db.products.updateOne({ _id: 1 }, { $set: { category: "food" } });

// update products set category = 'food' where _id = 2
db.products.updateOne({ _id: 2 }, { $set: { category: "food" } });

// update products set tags = ['food'] where category = 'food' and tags is null
db.products.updateMany(
  {
    $and: [{ category: { $eq: "food" } }, { tags: { $exists: false } }],
  },
  { $set: { tags: ["food"] } },
);

// insert into products (_id, name, wrong) values (9, 'ups salah', 'salah')
db.products.insertOne({ _id: 9, name: "ups salah", wrong: "salah" });

// update products set name = '...', price = '...', ... where _id = 9 (replace entire document)
db.products.replaceOne(
  { _id: 9 },
  {
    name: "Adidas Sepatu Lari Pria",
    price: new NumberLong("1100000"),
    category: "shoes",
    tags: ["adidas", "shoes", "running"],
  },
);

// update products set stock = 0
db.products.updateMany({}, { $set: { stock: 0 } });

// update products set stock = stock + 10
db.products.updateMany({}, { $inc: { stock: 10 } });

// alter table customers rename column name to full_name
db.customers.updateMany({}, { $rename: { name: "full_name" } });

// update customers set wrong = 'ups'
db.customers.updateMany({}, { $set: { wrong: "ups" } });

// update customers set wrong = null (remove field)
db.customers.updateMany({}, { $unset: { wrong: "" } });

// update products set lastModifiedDate = now()
db.products.updateMany(
  {},
  { $currentDate: { lastModifiedDate: { $type: "date" } } },
);

// update products set ratings = [90, 80, 70]
db.products.updateMany({}, { $set: { ratings: [90, 80, 70] } });

// update products set ratings[matched] = 100 where ratings = 90
db.products.updateMany({ ratings: 90 }, { $set: { "ratings.$": 100 } });

// update products set ratings[all] = 100
db.products.updateMany({}, { $set: { "ratings.$[]": 100 } });

// update products set ratings = [100]
db.products.updateMany({}, { $set: { ratings: [100] } });

// update products set ratings[element] = 100 where element >= 80
db.products.updateMany(
  {},
  { $set: { "ratings.$[element]": 100 } },
  { arrayFilters: [{ element: { $gte: 80 } }] },
);

// update products set ratings[0] = 50, ratings[1] = 60
db.products.updateMany({}, { $set: { "ratings.0": 50, "ratings.1": 60 } });

// update products set tags = array_add_unique(tags, 'popular') where _id = 1
db.products.updateOne({ _id: 1 }, { $addToSet: { tags: "popular" } });

// update products set ratings = ratings[1:] (remove first element) where _id = 1
db.products.updateOne({ _id: 1 }, { $pop: { ratings: -1 } });

// update products set ratings = ratings[:-1] (remove last element) where _id = 2
db.products.updateOne({ _id: 2 }, { $pop: { ratings: 1 } });

// update products set ratings = array_remove(ratings) where ratings >= 80
db.products.updateMany({}, { $pull: { ratings: { $gte: 80 } } });

// update products set ratings = array_append(ratings, 100)
db.products.updateMany({}, { $push: { ratings: 100 } });

// update products set ratings = array_remove_all(ratings, [100])
db.products.updateMany({}, { $pullAll: { ratings: [100] } });

// update products set ratings = array_append(ratings, 100, 200, 300)
db.products.updateMany({}, { $push: { ratings: { $each: [100, 200, 300] } } });

// update products set tags = array_add_unique(tags, 'trending', 'popular')
db.products.updateMany(
  {},
  { $addToSet: { tags: { $each: ["trending", "popular"] } } },
);

// update products set tags = array_insert(tags, position=1, 'hot')
db.products.updateMany(
  {},
  { $push: { tags: { $each: ["hot"], $position: 1 } } },
);

// update products set ratings = array_append_sort_desc(ratings, 100, 200, 300, 400, 500)
db.products.updateMany(
  {},
  { $push: { ratings: { $each: [100, 200, 300, 400, 500], $sort: -1 } } },
);

// update products set ratings = array_append_slice_last10(ratings, 100, 200, 300, 400, 500)
db.products.updateMany(
  {},
  { $push: { ratings: { $each: [100, 200, 300, 400, 500], $slice: -10 } } },
);

// update products set ratings = array_append_sort_desc_slice_first10(ratings, 100, 200, 300, 400, 500)
db.products.updateMany(
  {},
  {
    $push: {
      ratings: { $each: [100, 200, 300, 400, 500], $slice: 10, $sort: -1 },
    },
  },
);

// insert into customers (_id, full_name) values ('spammer', 'Spammer')
db.customers.insertOne({ _id: "spammer", full_name: "Spammer" });

// delete from customers where _id = 'spammer'
db.customers.deleteOne({ _id: "spammer" });

// insert into customers (_id, full_name) values ('spammer1', ...), ('spammer2', ...), ('spammer3', ...)
db.customers.insertMany([
  { _id: "spammer1", full_name: "Spammer1" },
  { _id: "spammer2", full_name: "Spammer2" },
  { _id: "spammer3", full_name: "Spammer3" },
]);

// delete from customers where _id like '%spammer%'
db.customers.deleteMany({ _id: { $regex: "spammer" } });

// begin;
// insert into customers values ('eko', 'Eko'), ('kurniawan', 'Kurniawan');
// update customers set full_name = 'Eko Kurniawan Khannedy' where _id in ('eko', 'kurniawan', 'khannedy');
// commit;
db.customers.bulkWrite([
  { insertOne: { document: { _id: "eko", full_name: "Eko" } } },
  { insertOne: { document: { _id: "kurniawan", full_name: "Kurniawan" } } },
  {
    updateMany: {
      filter: { _id: { $in: ["eko", "kurniawan", "khannedy"] } },
      update: { $set: { full_name: "Eko Kurniawan Khannedy" } },
    },
  },
]);

// create index idx_category on products (category asc)
db.products.createIndex({ category: 1 });

// show indexes from products
db.products.getIndexes();

// select * from products where category = 'food'
db.products.find({ category: "food" });

// explain select * from products where category = 'food'
db.products.find({ category: "food" }).explain();

// explain select * from products order by category asc
db.products.find({}).sort({ category: 1 }).explain();

// explain select * from products where tag = 'laptop'
db.products.find({ tag: "laptop" }).explain();

// create index idx_stock_tags on products (stock asc, tags asc)
db.products.createIndex({ stock: 1, tags: 1 });

// select * from products where stock = 10 and tags = 'popular'
db.products.find({ stock: 10, tags: "popular" });

// explain select * from products where stock = 10
db.products.find({ stock: 10 }).explain();

// explain select * from products where stock = 10 and tags = 'popular'
db.products.find({ stock: 10, tags: "popular" }).explain();

// explain select * from products where tags = 'popular'
db.products.find({ tags: "popular" }).explain();

// create fulltext index on products (name, category, tags) with weights
db.products.createIndex(
  { name: "text", category: "text", tags: "text" },
  { weights: { name: 10, category: 5, tags: 1 } },
);

// show indexes from products
db.products.getIndexes();

// select * from products where match(name, category, tags) against ('mie')
db.products.find({ $text: { $search: "mie" } });

// select * from products where match(name, category, tags) against ('mie laptop')
db.products.find({ $text: { $search: "mie laptop" } });

// select * from products where match(name, category, tags) against ('mie sedap')
db.products.find({ $text: { $search: "mie sedap" } });

// select * from products where match(name, category, tags) against ('mie' exclude 'sedap')
db.products.find({ $text: { $search: "mie -sedap" } });

// explain select * from products where match(name, category, tags) against ('mie' exclude 'sedap')
db.products.find({ $text: { $search: "mie -sedap" } }).explain();

// select *, match(name, category, tags) as searchScore from products where match against ('mie')
db.products.find(
  { $text: { $search: "mie" } },
  { searchScore: { $meta: "textScore" } },
);

// create index idx_customfields on customers (customFields.** asc) -- wildcard index
db.customers.createIndex({ "customFields.$**": 1 });

// insert into customers (...) values (...), (...), (...)
db.customers.insertMany([
  {
    _id: "budi",
    full_name: "budi",
    customFields: { hobby: "Gaming", university: "Universitas Belum Ada" },
  },
  {
    _id: "rully",
    full_name: "rully",
    customFields: { ipk: 3.2, university: "Universitas Belum Ada" },
  },
  {
    _id: "rudi",
    full_name: "rudi",
    customFields: { motherName: "tini", passion: "entepreneur" },
  },
]);

// explain select * from customers where customFields.passion = 'entepreneur'
db.customFields.find({ "customFields.passion": "entepreneur" }).explain();

// create table sessions
db.createCollection("sessions");

// create index idx_createdat on sessions (createdAt asc) -- ttl index, auto delete after 10s
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });

// insert into sessions (_id, session, createdAt) values (1, 'Session 1', now())
db.sessions.insertOne({ _id: 1, session: "Session 1", createdAt: new Date() });

// create unique index idx_email on customers (email asc) -- sparse (skip null)
db.customers.createIndex({ email: 1 }, { unique: true, sparse: true });

// update customers set email = 'eko@example.com' where _id = 'eko'
db.customers.updateOne({ _id: "eko" }, { $set: { email: "eko@example.com" } });

// update customers set email = 'eko@example.com' where _id = 'joko' -- will error: duplicate
db.customers.updateOne({ _id: "joko" }, { $set: { email: "eko@example.com" } });

// create index idx_fullname on customers (full_name asc) -- case insensitive collation
db.customers.createIndex(
  { full_name: 1 },
  { collation: { locale: "en", strength: 2 } },
);

// select * from customers where full_name = 'Eko Kurniawan Khannedy'
db.customers.find({ full_name: "Eko Kurniawan Khannedy" });

// select * from customers where full_name = 'EKO Kurniawan KHANNEDY' collate case_insensitive
db.customers
  .find({ full_name: "EKO Kurniawan KHANNEDY" })
  .collation({ locale: "en", strength: 2 });

// create index idx_price on products (price asc) where stock > 0 -- partial index
db.products.createIndex(
  { price: 1 },
  { partialFilterExpression: { stock: { $gt: 0 } } },
);

// create user 'mongo' identified by 'mongo' with roles (userAdminAnyDatabase, readWriteAnyDatabase)
db.createUser({
  user: "mongo",
  pwd: "mongo",
  roles: ["userAdminAnyDatabase", "readWriteAnyDatabase"],
});
