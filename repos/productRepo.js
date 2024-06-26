var db = require('../fn/db');
var config = require('../config/config');

exports.loadAll = () => {
    var sql = 'select * from products';
    return db.load(sql);
}

exports.loadAllByCat = (catId, offset) => {
    var sql = `select * from products where CatID = ${catId} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.loadAllByBrand = (brandId, offset) => {
    var sql = `select * from products where BrandID = ${brandId} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCat = catId => {
    var sql = `select count(*) as total from products where CatID = ${catId}`;
    return db.load(sql);
}

exports.countByBrand = brandId => {
    var sql = `select count(*) as total from products where BrandID = ${brandId}`;
    return db.load(sql);
}

exports.loadByNewestOption = (limit) => {
    var sql = `select * from products order by Date DESC limit ${limit}`;
    return db.load(sql);
}

exports.loadByViewOption = (limit) => {
    var sql = `select * from products order by Viewer DESC limit ${limit}`;
    return db.load(sql);
}

exports.loadBySoldOption = (limit) => {
    var sql = `select * from products order by Sold DESC limit ${limit}`;
    return db.load(sql);
}

exports.single = (proID) => {
    return new Promise((resolve, reject) => {
        var sql = `select * from products where ProID = ${proID}`;
        db.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            }
            else {
                resolve(rows[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

//===
exports.add = productEntity => {
    var sql = `insert into products(ProName, Price, Quantity, Viewer, CatID, BrandID, Description, Date, Image) values('${productEntity.ProName}', ${productEntity.Price}, ${productEntity.Quantity}, ${productEntity.Viewer}, ${productEntity.CatID}, ${productEntity.BrandID}, '${productEntity.Description}', '${productEntity.Date}', '${productEntity.Image}')`;
    return db.save(sql);
}

exports.delete = proID => {
    var sql = `delete from products where ProID = ${proID}`;
    return db.save(sql);
}

exports.update = productEntity => {
    var sql = `update products set ProName = '${productEntity.ProName}', Price = ${productEntity.Price}, Quantity = ${productEntity.Quantity}, Viewer = ${productEntity.Viewer}, CatID = ${productEntity.CatID}, BrandID = ${productEntity.BrandID}, Description = '${productEntity.Description}', Date = '${productEntity.Date}', Image = '${productEntity.Image}' where ProID = ${productEntity.ProID}`;
    return db.save(sql);
}
//===

exports.get = (proID) => {
    var sql = `select * from products where ProID = ${proID}`;
    return db.load(sql);
}

exports.randomSameCategory = catID => {
    var sql = `select * from products where CatID = ${catID} order by RAND() LIMIT ${config.LIMIT_SAME}`;
    return db.load(sql);
}

exports.randomSameBrand = brandID => {
    var sql = `select * from products where BrandID = ${brandID} order by RAND() LIMIT ${config.LIMIT_SAME}`;
    return db.load(sql);
}

exports.search = (key) => {
    var sql = "select * from products where ProName like '%" + `${key}` + "%'";
    return db.load(sql);
}

exports.count = () => {
    var sql = "select count(*) as soluong from products";
    return db.load(sql);
}