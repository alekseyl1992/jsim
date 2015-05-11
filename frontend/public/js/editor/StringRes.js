
var en = {
    palette: "Palette",
    source: "Source",
    queue: "Queue",
    splitter: "Splitter",
    sink: "Sink",

    ui: {
        ok: 'Ok',
        cancel: 'Cancel',
        open: 'Open',
        yes: 'Yes',
        no: 'No'
    },

    messages: {
        shouldBeANumber: 'should be a number',
        unableToGetModelList: 'Unable to get model list',
        unableToLoadModel: 'Unable to get model',
        modelLoaded: 'Model loaded',
        unableToSaveModel: 'Unable to save model',
        modelSaved: 'Model saved'
    },

    props: {
        model: {
            name: "name",
            duration: "duration",
            runs: "runs"
        },

        objects: {
            type: "type",
            name: "name",
            lambda: "λ",
            mu: "μ",
            channels: "channels",
            limit: "size",
            pA: "pA"
        }
    },

    reportPage: {
        key: "Key",
        value: "Value",
        name: "Name"
    },

    report: {
        author: "Author",
        modelName: "Model name",
        simulationDate: "Simulation date",

        name: "name",
        type: "type",
        useCount: "use count",

        queue: {
            name: "name",
            type: "type",
            useCount: "use count",
            avgQueueSize: "avg queue size",
            devQueueSize: "queue size dev",
            avgQueueTime: "avg queue time",
            devQueueTime: "queue time dev",
            avgSystemTime: "avg system time",
            devSystemTime: "system time dev",
            serverUsage: "server usage",
            rejectedCount: "rejected count",
            rejectedPercent: "rejected percentage"
        },

        plots: {
            modelTime: "Model time",
            waitTime: "Wait time",
            queueSize: "Queue size"
        }
    }
};

var ru = {
    palette: "Палитра",
    source: "Источник",
    queue: "Очередь",
    splitter: "Делитель",
    sink: "Сток",

    ui: {
        ok: 'Ок',
        cancel: 'Отмена',
        open: 'Открыть',
        yes: 'Да',
        no: 'Нет',
    },

    messages: {
        shouldBeANumber: 'должно быть числом',
        unableToGetModelList: 'Не удалось получить список моделей',
        unableToLoadModel: 'Не удалось загрузить модель',
        modelLoaded: 'Модель загружена',
        unableToSaveModel: 'Не удалось сохранить модель',
        modelSaved: 'Модель сохранена'
    },

    props: {
        model: {
            name: "название",
            duration: "время",
            runs: "запуски"
        },

        objects: {
            type: "тип",
            name: "название",
            lambda: "λ",
            mu: "μ",
            channels: "каналы",
            limit: "размер",
            pA: "pA"
        }
    },

    reportPage: {
        key: "Параметр",
        value: "Значение",
        name: "Название"
    },

    report: {
        author: "Автор",
        modelName: "Название модели",
        simulationDate: "Дата симуляции",

        name: "Название",
        type: "Тип",
        useCount: "Использований",

        queue: {
            name: "Название",
            type: "Тип",
            useCount: "Использований",
            avgQueueSize: "Средний размер очереди",
            devQueueSize: "Дисперсия размера очереди",
            avgQueueTime: "Среднее время ожидания",
            devQueueTime: "Дисперсия времени ожидания",
            avgSystemTime: "Среднее время в системе",
            devSystemTime: "Дисперсия времени в системе",
            serverUsage: "Коэффициент загрузки",
            rejectedCount: "Количество отказов",
            rejectedPercent: "Процент отказов"
        },

        plots: {
            modelTime: "Модельное время",
            waitTime: "Время ожидания",
            queueSize: "Размер очереди"
        }
    }
};

function getRes() {
    return ru;
}

define([], function () {
    return getRes();
});