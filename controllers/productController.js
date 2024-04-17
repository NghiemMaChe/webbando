var express = require('express');
var productRepo = require('../repos/productRepo');
var brandRepo = require('../repos/brandRepo');
var catRepo = require('../repos/categoryRepo');
var detailRepo = require('../repos/detailRepo');
var config = require('../config/config');
var router = express.Router();

router.get('/byCat/:catId', (req, res) => {
    var catId = req.params.catId;

    var page = req.query.page;
    if (!page) {
        page = 1;
    }

    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var loadAll = productRepo.loadAllByCat(catId, offset);
    var countByCat = productRepo.countByCat(catId);
    var category = catRepo.single(catId);
    Promise.all([loadAll, countByCat, category]).then(([pRows, countRows, categoryRows]) => {
        // console.log(pRows);
        // console.log(countRows);
        console.log(categoryRows);
        var total = countRows[0].total;
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (let i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }

        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            catName: categoryRows.CatName
        };
        res.render('product/byCat', vm);
    });
});

router.get('/byBrand/:brandId', (req, res) => {
    var brandId = req.params.brandId;

    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    console.log(page);
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;
    console.log(offset);
    var loadAll = productRepo.loadAllByBrand(brandId, offset);
    var countByBrand = productRepo.countByBrand(brandId);
    var brand = brandRepo.single(brandId);
    Promise.all([loadAll, countByBrand, brand]).then(([pRows, countRows, brandRows]) => {
        var total = countRows[0].total;
        console.log(total);
        var nPages = total / config.PRODUCTS_PER_PAGE;
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (let i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }

        var vm = {
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            brandName: brandRows.BrandName
        };
        res.render('product/byBrand', vm);
    });
});

router.get('/detail/:proID', (req, res) => {
    var proID = req.params.proID;
    productRepo.single(proID).then(product => {
        if (product) {
            var brand = brandRepo.single(product.BrandID);
            var category = catRepo.single(product.CatID);
            var detail = detailRepo.single(proID);
            var product_same_category = productRepo.randomSameCategory(product.CatID);
            var product_same_brand = productRepo.randomSameBrand(product.BrandID);
            Promise.all([brand, category, detail, product_same_brand, product_same_category]).then(([brand, category, detail, product_same_brand, product_same_category]) => {
                var vm = {
                    product: product,
                    category: category,
                    brand: brand,
                    detail: detail,
                    product_same_brand: product_same_brand,
                    product_same_category: product_same_category,
                    product_available: product.Quantity - product.Sold
                };
                res.render('product/detail', vm);
            })
        }
        else {
            res.redirect('error/index');
        }
    });
});

//===================================================
// Route để hiển thị form thêm sản phẩm
router.get('/add', (req, res) => {
    var vm = {
        showAlert: false,
        brands: [], // Load danh sách thương hiệu
        categories: [] // Load danh sách loại sản phẩm
    };
    Promise.all([brandRepo.loadAll(), catRepo.loadAll()]).then(([brands, categories]) => {
        vm.brands = brands;
        vm.categories = categories;
        res.render('product/add', vm);
    });
});

// Route để xử lý yêu cầu thêm sản phẩm
router.post('/add', (req, res) => {
    productRepo.add(req.body).then(() => {
        var vm = {
            showAlert: true,
            brands: [], // Load danh sách thương hiệu
            categories: [] // Load danh sách loại sản phẩm
        };
        Promise.all([brandRepo.loadAll(), catRepo.loadAll()]).then(([brands, categories]) => {
            vm.brands = brands;
            vm.categories = categories;
            res.render('product/add', vm);
        });
    }).catch(err => {
        res.end('fail');
    });
});

// Route để hiển thị form xác nhận xóa sản phẩm
router.get('/delete/:proID', (req, res) => {
    var proID = req.params.proID;
    var vm = {
        proID: proID
    };
    res.render('product/delete', vm);
});

// Route để xử lý yêu cầu xóa sản phẩm
router.post('/delete/:proID', (req, res) => {
    var proID = req.params.proID;
    productRepo.delete(proID).then(() => {
        res.redirect('/');
    });
});

// Route để hiển thị form chỉnh sửa thông tin sản phẩm
router.get('/edit/:proID', (req, res) => {
    var proID = req.params.proID;
    productRepo.single(proID).then(product => {
        if (product) {
            var vm = {
                product: product,
                brands: [], // Load danh sách thương hiệu
                categories: [] // Load danh sách loại sản phẩm
            };
            Promise.all([brandRepo.loadAll(), catRepo.loadAll()]).then(([brands, categories]) => {
                vm.brands = brands;
                vm.categories = categories;
                res.render('product/edit', vm);
            });
        } else {
            res.redirect('/');
        }
    });
});

// Route để xử lý yêu cầu cập nhật thông tin sản phẩm
router.post('/edit/:proID', (req, res) => {
    var proID = req.params.proID;
    productRepo.update(req.body).then(() => {
        res.redirect('/');
    });
});

module.exports = router;