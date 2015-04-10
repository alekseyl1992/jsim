var express = require('express');
var router = express.Router();

var en = {
    index: {
        logout: "logout",
        save: "Save",
        open: "Open",
        new: "New",
        oldBrowser: "Your browser is not supported. HTML5 support required",
        modelProps: "Model props",
        selectedObjectProps: "Selected object props",
        simulationSuccessTitle: "Simulation completed successfully",
        simulationSuccess: "Simulation completed successfully.",
        showReport: "Show report?",
        simulationErrorTitle: "Simulation error",
        simulationError: "Simulation error occurred:",
        noDetails: "No details specified",
        chooseModelTitle: "Choose a model",
        chooseModel: "Choose a model to load",
        createConfirmTitle: "Create new model?",
        createConfirm: "Do you really want to create a new model?",
        createConfirmDetails: "All unsaved data will be lost."
    },
    login: {
        subtitle: "log in",
        username: "Username",
        password: "Password",
        usernamePlaceholder: "Enter username",
        passwordPlaceholder: "Enter password",
        logIn: "Log in",
        or: "or",
        register: "Register"
    },
    register: {
        subtitle: "register",
        usernamePlaceholder: "Enter username",
        passwordPlaceholder: "Enter password",
        register: "Register"
    },

    _partials: {
        welcome: {
            welcomeMessageTitle: "Welcome to jsim - discrete event simulation system written in Java and JS.",
            welcomeMessageSubTitle: "Please log in or register to continue."
        }
    }
};

var ru = {
    index: {
        logout: "выйти",
        save: "Сохранить",
        open: "Открыть",
        new: "Новые",
        oldBrowser: "Ваш бразуер не поддерживвется. Требуется поддержка HTML5",
        modelProps: "Свойства модели",
        selectedObjectProps: "Свойства объекта",
        simulationSuccessTitle: "Симуляция завершена успешно",
        simulationSuccess: "Симуляция завершена успешно.",
        showReport: "Показать отчёт?",
        simulationErrorTitle: "Ошибка симуляции",
        simulationError: "Произошла ошибка симуляции:",
        noDetails: "Подробности неизвестны",
        chooseModelTitle: "Загрузка модели",
        chooseModel: "Выберите модель для загрузки",
        createConfirmTitle: "Создание новой модели",
        createConfirm: "Вы действительно хотите создать новую модель?",
        createConfirmDetails: "Все несохранённые данные будут утеряны."
    }
};

router.get('/', function(req, res, next) {
    res.render('index', {
        s: en.index,
        user: {
            name: req.user.username
        }
    });
});

router.get('/report', function(req, res, next) {
    res.render('report', { s: en.report });
});

router.get('/experiment', function(req, res, next) {
    res.render('experiment', { s: en.experiment });
});

router.get('/register', function(req, res, next) {
    res.render('register', { s: en.register, error: req.flash('error') });
});

router.get('/login', function(req, res, next) {
    res.render('login', { s: en.login, error: req.flash('error') });
});

module.exports = router;
