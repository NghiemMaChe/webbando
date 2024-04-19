var express = require('express');
var productRepo = require('../repos/productRepo');
var categoryRepo = require('../repos/categoryRepo');
var brandRepo = require('../repos/brandRepo');
var orderRepo = require('../repos/orderRepo');
var router = express.Router();
var restrict = require('../middle-wares/restrict');


router.get('/', restrict, (req, res) => {
    if (req.session.user.f_Permission === 0) {
        res.redirect('/error/index');
    }
    else {
        
        var rowCountBrand = brandRepo.count();
        var rowCountCategory = categoryRepo.count();
        var rowCountProduct = productRepo.count();
        Promise.all([rowCountProduct,rowCountBrand,rowCountCategory]).then(([rowProduct, rowBrand, rowCategory]) => {
            var vm = {
                layout: 'admin.handlebars',
                countProduct: rowProduct[0].soluong,
                countBrand: rowBrand[0].soluongth,
                countCategory: rowCategory[0].soluongtl
            }
            res.render('admin/index', vm);
        }); 
    }
})

router.get('/category', restrict, (req, res) => {
        categoryRepo.loadAll().then(rows => {
            var vm = {
                layout: 'admin.handlebars',
                categories: rows
            };
            res.render('admin/category/index', vm);
        });
    });
    
    router.get('/category/edit', restrict, (req, res) => {
        categoryRepo.single(req.query.id).then(c => {
            var vm = {
                Category: c,
                layout: 'admin.handlebars',
            };
            res.render('admin/category/edit', vm);
        });
    });
    
    router.post('/category/edit', restrict, (req, res) => {
        categoryRepo.update(req.body).then(value => {
            res.redirect('/admin/category');
        });
    });
    
    router.get('/category/delete', restrict, (req, res) => {
        var vm = {
            layout: 'admin.handlebars',
            CatId: req.query.id
        }
        res.render('admin/category/delete', vm);
    });
    
    router.post('/category/delete', restrict, (req, res) => {
        categoryRepo.delete(req.body.CatId).then(value => {
            res.redirect('/admin/category');
        });
    });
    
    router.get('/category/add', restrict, (req, res) => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: false
        }
        res.render('admin/category/add', vm);
    });
    
    router.post('/category/add', restrict, (req, res) => {
        console.log(req.body);
        categoryRepo.add(req.body).then(value => {
            var vm = {
                layout: 'admin.handlebars',
                showAlert: true
            };
            res.render('admin/category/add', vm);
        }).catch(err => {
            res.end('fail');
        });
    });

router.get('/brand', restrict, (req, res) => {
    brandRepo.loadAll().then(rows => {
        var vm = {
            layout: 'admin.handlebars',
            brands: rows
        };
        res.render('admin/brand/index', vm);
    });
});

router.get('/brand/edit', restrict, (req, res) => {
    brandRepo.single(req.query.id).then(b => {
        var vm = {
            Brand: b,
            layout: 'admin.handlebars',
        };
        res.render('admin/brand/edit', vm);
    });
});

router.post('/brand/edit', restrict, (req, res) => {
    console.log(req.body);
    brandRepo.update(req.body).then(value => {
        res.redirect('/admin/brand');
    });
});


router.get('/brand/delete', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        BrandID: req.query.id
    }
    res.render('admin/brand/delete', vm);
});

router.post('/brand/delete', restrict, (req, res) => {
    brandRepo.delete(req.body.BrandID).then(value => {
        res.redirect('/admin/brand');
    });
});
router.get('/brand/add', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    }
    res.render('admin/brand/add', vm);
});
router.post('/brand/add', restrict, (req, res) => {
    brandRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: true
        };
        res.render('admin/brand/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});

//======================================================================================================================
router.get('/product', restrict, (req, res) => {
    productRepo.loadAll().then(rows => {
        var vm = {
            layout: 'admin.handlebars',
            products: rows,
            
        };
        res.render('admin/product/index', vm);
    });
});

router.get('/product/add', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',

        showAlert: false
    }
    res.render('admin/product/add', vm);
});
router.post('/product/add', restrict, (req, res) => {
    productRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',

            showAlert: true
        };
        res.render('admin/product/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});


// Chỉnh sửa sản phẩm
router.get('/product/edit', restrict, (req, res) => {
    productRepo.single(req.query.id).then(b => {
        var vm = {
            Product: b,
            layout: 'admin.handlebars',
        };
        res.render('admin/product/edit', vm);
    });
});

router.post('/product/edit', restrict, (req, res) => {
    console.log(req.body);
    productRepo.update(req.body).then(value => {
        res.redirect('/admin/product');
    });
});


// Xóa sản phẩm

router.get('/product/delete', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        ProID: req.query.id
    }
    res.render('admin/product/delete', vm);
});

router.post('/product/delete', restrict, (req, res) => {
    productRepo.delete(req.body.ProID).then(value => {
        res.redirect('/admin/product');
    });
});

router.get('/order', restrict, (req, res) => {
    // Gọi phương thức loadAllOrders từ repo để lấy danh sách các đơn hàng
    orderRepo.loadAll().then(orders => {
        // Tạo view model chứa danh sách các đơn hàng
        var vm = {
            layout: 'admin.handlebars',
            orders: orders
        };
        // Render trang hiển thị đơn hàng với view model tương ứng
        res.render('admin/order/index', vm);
    }).catch(err => {
        // Xử lý lỗi nếu có
        res.end('fail');
    });
});
module.exports = router;
