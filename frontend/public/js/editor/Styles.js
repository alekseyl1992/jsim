
define(['easeljs'], function(easeljs) {
    var object = {
        colors: {
            contour: "black",
            gradient: ["#AFA", "#6A6"],
            selectedGradient: ["#8A8", "#282"],
            connectionPointFill: "white",
            connection: "black",
            selectionFilter: new easeljs.ColorFilter(1, 1, 1, 1, 10, 60, 10, 100)
        },
        sizes: {
            w: 160,
            h: 80,
            bw: 140,
            contourBold: 4,
            textOffset: 10,
            connectionPointRadius: 3,
            outputsDelta: 32,
            connection: 3,
            connectionProbeStep: 18,
            connectionArrowLen: 14,
            connectionArrowAngle: Math.PI / 10
        },
        labelFont: "bold 18px Arial"
    };

    var palette = {
        colors: {
            contour: "black",
            gradient: ["#EEE", "#BBB"]
        },
        sizes: {
            x: 10,
            y: 10,
            objectOffset: 10,
            paletteOffset: 10
        },
        labelFont: "bold 18px Arial"
    };

    return {
        object: object,
        palette: palette
    };
});