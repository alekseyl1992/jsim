define(['lodash', 'createjs'],
    function(_, createjs) {
        function ResourceManager(onProgress, onComplete) {
            var self = this;

            //all textures should have .png format
            this.texList = ["source", "sink", "queue", "splitter"];

            this.onProgress = onProgress;
            this.onComplete = onComplete;

            this.images = [];
            this.spriteSheets = [];

            var queue = new createjs.LoadQueue();
            queue.on("complete", handleComplete, this);
            queue.on("progress", handleProgress, this);

            var manifest = [];
            _.each(ResourceManager.texList, function(tex) {
                manifest.push({
                    id: tex,
                    src: "gfx/" + tex + ".png"
                });
            });

            queue.loadManifest(manifest, true, "res/");

            function handleComplete() {
                _.each(manifest, function(res) {
                    self.images[res.id] = queue.getResult(res.id);
                });

                self.loaded = true;
                self.onComplete();
            }

            function handleProgress(event) {
                this.onProgress(event.progress);
            }

            this.getSpriteSheet = function(tex) {
                var spriteSheet = this.spriteSheets[tex];

                if (!spriteSheet) { //if not cached
                    var image = this.images[tex];

                    if (_.isUndefined(image))
                        throw "No such texture: " + tex;

                    var data = {
                        images: [image],
                        frames: {
                            width: image.width,
                            height: image.height
                        }
                    };

                    this.spriteSheets[tex] = spriteSheet = new createjs.SpriteSheet(data);
                }

                return spriteSheet;
            }
        }

        return ResourceManager;
    }
);