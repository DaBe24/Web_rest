var Menu = require('../models/menu')

const { body,validationResult } = require("express-validator");

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        menu_count: function(callback) {
            Menu.countDocuments({},callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Сайт моего заведения',
            error: err, data: results });
    });
};

// Показать список всего меню.
exports.menu_list = function(req, res, next) {

    Menu.find({}, 'dish')
        .populate('dish')
        .populate('price')
        .exec(function (err, menu) {
            if (err) {
                return next(err);
            }
            else {
                res.render('menu_list', {title: 'Меню', menu_list: menu});
            }
        });

};

// Показать подробную страницу для данного блюда.
exports.menu_detail = function(req, res) {

    async.parallel({
        menu: function(callback) {

            Menu.findById(req.params.id)
                .populate('dish')
                .populate('price')
                .populate('description')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.menu==null) { // No results.
            var err = new Error('Блюдо не найдено');
            err.status = 404;
            return next(err);
        }

        res.render('menu_detail', {menu:  results.menu } );
    });

};

// Показать форму создания блюда по запросу GET.
exports.menu_create_get = function(req, res) {

    async.parallel({},
        function(err, results) {
        if (err) { return next(err); }
        res.render('dish_form', {
            title: 'Предложение по одобавлению блюда'
        });
    });

};

// Создать блюдо по запросу POST.
exports.menu_create_post = [

    // Validate and sanitize fields.
    body('dish', 'Название блюда не должен быть пустым. ').trim().isLength({ min: 3 }).escape(),
    body('description', 'Необходим список неоходимых продуктов.').trim().isLength({ min: 3 }).escape(),
    body('price', 'Нужно указать цену').trim().isLength({ min: 1 }).isInt().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = validationResult(req);

        var menu = new Menu(
            { dish: req.body.dish,
                description: req.body.description,
                price: req.body.price
            });

        if (!errors.isEmpty()) {

            async.parallel({},
                function(err, results) {
                if (err) { return next(err); }

                res.render('dish_form', { title: 'Предложение по одобавлению блюд',
                    menu: menu, errors: errors.array() });
            });
        }
        else {
            menu.save(function (err) {
                if (err) { return next(err); }
                    res.render('dish_form',
                        {title: 'Предложение по одобавлению блюда',
                            exect: 'Успешно'});
            });
        }
    }
];

// Показать форму удаления блюда по запросу GET.
exports.menu_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Menu delete GET');
};

// Удалить блюдо по запросу POST.
exports.menu_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Menu delete POST');
};

// Показать форму обновления блюда по запросу GET.
exports.menu_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Menu update GET');
};

// Обновить блюда по запросу POST.
exports.menu_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Menu update POST');
};

