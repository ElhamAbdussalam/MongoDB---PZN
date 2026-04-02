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

db.customers.insertOne({
  _id: "spammer",
  full_name: "Spammer",
});

db.customers.deleteOne({
  _id: "spammer",
});

db.customers.insertMany([
  {
    _id: "spammer1",
    full_name: "Spammer1",
  },
  {
    _id: "spammer2",
    full_name: "Spammer2",
  },
  {
    _id: "spammer3",
    full_name: "Spammer3",
  },
]);

db.customers.deleteMany({
  _id: {
    $regex: "spammer",
  },
});
