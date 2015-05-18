
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
        createConfirmDetails: "All unsaved data will be lost.",

        error: {
            emptyModel: "Model is empty",
            notConnected: "All outputs should be connected somewhere",
            unsupportedType: "Unsupported type"
        }
    },
    login: {
        subtitle: "log in",
        username: "Username",
        password: "Password",
        usernamePlaceholder: "Enter username",
        passwordPlaceholder: "Enter password",
        logIn: "Log in",
        or: "or",
        register: "Register",

        missingCredentials: "Missing credentials",
        wrongLoginOrPassword: 'Wrong username or password'
    },
    register: {
        subtitle: "register",
        username: "Username",
        password: "Password",
        usernamePlaceholder: "Enter username",
        passwordPlaceholder: "Enter password",
        register: "Register",

        missingCredentials: "Missing credentials",
        alreadyInUse: "Username already in use"
    },
    report: {
        subtitle: "report",
        summary: "Report summary",
        key: "Key",
        value: "Value",
        usageStats: "Usage statistics",
        objectName: "Object name",
        usageCount: "Usage count",
        queueStats: "Queue stats",
        waitTimeVsTime: "Wait time vs. time",
        queueSizeVsTime: "Queue size vs. time"
    },

    _partials: {
        welcome: {
            title: "Welcome to jsim - discrete event simulation system written in Java and JS.",
            subTitle: "Please log in or register to continue."
        }
    }
};

var ru = {
    index: {
        logout: "выйти",
        save: "Сохранить",
        open: "Открыть",
        new: "Создать",
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
        createConfirmDetails: "Все несохранённые данные будут утеряны.",

        error: {
            emptyModel: "Модель пуста",
            notConnected: "Все выходы должны быть соединены со входами",
            unsupportedType: "Неподдерживаемый тип"
        }
    },
    login: {
        subtitle: "авторизация",
        username: "Имя пользователя",
        password: "Пароль",
        usernamePlaceholder: "Введите имя пользователя",
        passwordPlaceholder: "Введите пароль",
        logIn: "Войти",
        or: "или",
        register: "Зарегистрироваться",

        missingCredentials: "Заполнены не все поля",
        wrongLoginOrPassword: 'Неверное имя пользователя или пароль'
    },
    register: {
        subtitle: "регистрация",
        username: "Имя пользователя",
        password: "Пароль",
        usernamePlaceholder: "Введите имя пользователя",
        passwordPlaceholder: "Введите пароль",
        register: "Зарегистрироваться",

        missingCredentials: "Заполнены не все поля",
        alreadyInUse: "Такой пользователь уже существует"
    },
    report: {
        subtitle: "отчёт",
        summary: "Общая информация",
        key: "Параметр",
        value: "Значение",
        usageStats: "Статистика использования",
        objectName: "Название объекта",
        usageCount: "Количество использований",
        queueStats: "Статистика по очередям",
        waitTimeVsTime: "Время ожидания от модельного времени",
        queueSizeVsTime: "Размер очереди от модельного времени"
    },

    _partials: {
        welcome: {
            title: "Добро пожаловать в jsim - дискретно-событийную систему имитационного моделирования, написанную на Java и JS.",
            subTitle: "Пожалуйста, зайдите или зарегистрируйтесь для продолжения работы."
        }
    }
};

function getLocalizedStrings(page) {
    var locales = {
        en: en,
        ru: ru
    };

    var locale = "ru";
    var result = locales[locale][page];

    result._p = locales[locale]._partials;

    return result;
}

module.exports = {
    lang: {
        ru: ru,
        en: en
    },

    getLocalizedStrings: getLocalizedStrings
};
