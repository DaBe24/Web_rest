var Reservation = require('../models/reservation');
const async = require("async");
const {body, validationResult} = require("express-validator");
const Menu = require("../models/menu");

// Показать список всех забронированных столиков.
exports.reservation_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Reservation list');
};

// Показать подробную страницу для данного столика.
exports.reservation_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Reservation detail: ' + req.params.id);
};

// Показать форму создания брони столика по запросу GET.
exports.reservation_create_get = function(req, res) {

    async.parallel({},
        function(err, results) {
            if (err) { return next(err); }
            res.render('reservation', {
                title: 'Бронирование столика(столик на 4)'
            });
        });

};

// Создать бронь по запросу POST.
exports.reservation_create_post = [

    // Validate and sanitize fields.
    body('n_table', 'Название блюда не должен быть пустым. ').trim().isInt().escape(),
    body('name', 'Необходимо ваше имя длиннее 3 символов').trim().isLength({ min: 3 }).escape(),
    body('a_date', 'Необходим список неоходимых продуктов.').trim().isDate().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = validationResult(req);

        var reser = new Reservation(
            { n_table: req.body.n_table,
                name: req.body.name,
                a_date: req.body.a_date
            });

        if (!errors.isEmpty()) {

            async.parallel({},
                function(err, results) {
                    if (err) { return next(err); }

                    res.render('reservation', { title: 'Бронирование столика(столик на 4)',
                        reser: reser, errors: errors.array() });
                });
        }
        else {
            if (req.body.n_table < 0 || req.body.n_table > 3){
                res.render('reservation', {
                    title: 'Бронирование столика(столик на 4)',
                    errors: [{msg: 'Можно бронировать только столики 1, 2 и 3'}]
                });
            }
            let now_date = Date.now();
            let res_date = new Date(req.body.a_date);

            if (now_date < res_date) {
                async.parallel({
                    todays_reservations: function (callback){
                        Reservation.findOne({a_date: req.body.a_date, n_table: req.body.n_table})
                            .populate('n_table')
                            .exec(callback)
                    }
                }, function (err, results) {
                    if (err) {
                        return next(err);
                    }

                    if (results.todays_reservations === null) {
                        reser.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                            res.render('reservation', {
                                title: 'Бронирование столика(столик на 4)',
                                exect: reser.a_date});
                        })
                    }
                    else
                        res.render('reservation', {
                            title: 'Бронирование столика(столик на 4)',
                            errors: [{msg: 'Стол уже забронирован'}]
                        });
                })
            }
            else
                res.render('reservation',
                    { title: 'Резервирование стола', errors: [{msg: 'Нельзя бронировать в прошлом'}]})
        }
    }
];

// Показать форму удаления брони столика по запросу GET.
exports.reservation_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Reservation delete GET');
};

// Удалить бронь столика по запросу POST.
exports.reservation_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Reservation delete POST');
};

// Показать форму обновления брони столика по запросу GET.
exports.reservation_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Reservation update GET');
};

// Обновить автора по запросу POST.
exports.reservation_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Reservation update POST');
};