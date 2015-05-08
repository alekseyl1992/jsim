
var en = {
    palette: "Palette",
    source: "Source",
    queue: "Queue",
    splitter: "Splitter",
    sink: "Sink",

    props: {
        name: "name",
        duration: "duration",
        runs: "runs",
        type: "type",
        lambda: "λ",
        mu: "μ",
        channels: "channels",
        limit: "size",
        pA: "pA"
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
        }
    }
};

var ru = {
    palette: "Палитра",
    source: "Источник",
    queue: "Очередь",
    splitter: "Делитель",
    sink: "Сток",

    props: {
        name: "название",
        duration: "время",
        runs: "запуски",
        type: "тип",
        lambda: "λ",
        mu: "μ",
        channels: "каналы",
        limit: "размер",
        pA: "pA"
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
        }
    }
};

function getRes() {
    return ru;
}

define([], function () {
    return getRes();
});