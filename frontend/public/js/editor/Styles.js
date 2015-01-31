
define([], function() {
    var object = {
        colors: {
            contour: "black",
            gradient: ["#AFA", "#6A6"],
            connectionPointFill: "white"
        },
        sizes: {
            w: 160,
            h: 80,
            bw: 140,
            contourBold: 4,
            textOffset: 10,
            connectionPointRadius: 3,
            outputsDelta: 32
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