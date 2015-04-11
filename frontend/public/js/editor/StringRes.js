
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
        limit: "limit",
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
        avgQueueSize: "avg queue size",
        avgQueueTime: "avg queue time",
        avgSystemTime: "avg system time",
        rejectedCount: "rejected count",
        rejectedPercent: "rejected percentage"
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
        limit: "предел",
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
        avgQueueSize: "Средний размер очереди",
        avgQueueTime: "Среднее время ожидания",
        avgSystemTime: "Среднее время в системе",
        rejectedCount: "Количество отказов",
        rejectedPercent: "Процент отказов"
    }
};

function getRes() {
    return ru;
}

define([], function () {
    return getRes();
});