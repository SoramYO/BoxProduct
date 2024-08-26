module.exports.createProduct = async (req, res, next) => {
    // if (req.file) {
    //     req.body.thumbnail = "/uploads/" + req.file.filename;
    // } else {
    //     req.body.thumbnail = "";
    // }
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề');
        return res.redirect('back');
    }
    if (req.body.title.length < 3 || req.body.title.length > 255) {
        req.flash('error', 'Tiêu đề phải từ 3 đến 255 ký tự');
        return res.redirect('back');
    }
    if (req.body.price || req.body.discountPercentage || req.body.stock) {
        if (isNaN(req.body.price) || isNaN(req.body.discountPercentage) || isNaN(req.body.stock)) {
            req.flash('error', 'Giá, phần trăm giảm giá, số lượng phải là số');
            return res.redirect('back');
        }
    }
    if (req.body.price < 0 || req.body.discountPercentage < 0 || req.body.stock < 0) {
        req.flash('error', 'Giá, phần trăm giảm giá, số lượng phải lớn hơn 0');
        return res.redirect('back');
    }
    next();
}

module.exports.editProduct = async (req, res, next) => {
    if (req.file) {
        req.body.thumbnail = "/uploads/" + req.file.filename;
    }else{
        req.body.thumbnail
    }
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề');
        return res.redirect('back');
    }
    if (req.body.title.length < 3 || req.body.title.length > 255) {
        req.flash('error', 'Tiêu đề phải từ 3 đến 255 ký tự');
        return res.redirect('back');
    }
    if (req.body.price || req.body.discountPercentage || req.body.stock) {
        if (isNaN(req.body.price) || isNaN(req.body.discountPercentage) || isNaN(req.body.stock)) {
            req.flash('error', 'Giá, phần trăm giảm giá, số lượng phải là số');
            return res.redirect('back');
        }
    }
    if (req.body.price < 0 || req.body.discountPercentage < 0 || req.body.stock < 0) {
        req.flash('error', 'Giá, phần trăm giảm giá, số lượng phải lớn hơn 0');
        return res.redirect('back');
    }
    next();
}