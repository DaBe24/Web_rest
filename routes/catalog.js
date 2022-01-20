var express = require('express');
var router = express.Router();

var menu_controller = require('../controllers/menuController')
var reservation_controller = require('../controllers/reservationController')

router.get('/', menu_controller.index)

router.get('/menu', menu_controller.menu_list)

router.get('/menu/create', menu_controller.menu_create_get)

router.post('/menu/create', menu_controller.menu_create_post)

router.get('/menu/:id', menu_controller.menu_detail);

router.get('/reservation/create', reservation_controller.reservation_create_get)

router.post('/reservation/create', reservation_controller.reservation_create_post)

module.exports = router;