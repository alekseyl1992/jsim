
//report entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'bootstrap-table', 'jquery.flot', 'lodash', 'mustache', 'util/Templater', 'util/Url', 'api/Client'],
        function (_1, _2, _3, flot, _, mustache, Templater, Url, Client) {
            $(function () {
                var client = new Client();

                var urlParams = Url.getParams();
                var modelName = urlParams.modelName;

                client.getModel(modelName, {
                    onComplete: function (data) {
                        renderExperiment({model: data});
                    },
                    onError: function (error) {
                        alert("AJAX error");
                    }
                });
            });

            function renderExperiment(expData) {
                var templates = {
                    expIteration: Templater.makeTemplate('#exp-iteration-template'),
                    expOverride: Templater.makeTemplate('#exp-override-template')
                };

                var $expIterationContainer = $('#exp-iterations-container');


                // add iteration button
                var $addButton = $('.exp-add-iteration-button');
                $addButton.click(addIteration.bind(this, $expIterationContainer, templates, expData.model));

                // add first iteration
                addIteration($expIterationContainer, templates, expData.model);


                $('#exp-summary-table').bootstrapTable({
                    data: [{key: "modelName", value: expData.model.name}]
                });

                $(".accordion").accordion({
                    collapsible: true,
                    heightStyle: "content"
                });
            }

            function addIteration($container, templates, model) {
                var $iteration = $(mustache.render(templates.expIteration, {id: 1}));


                var $expOverridesTable = $iteration.find('.exp-overrides-table');
                addOverride($expOverridesTable, templates, model);

                $iteration.appendTo($container);

                $iteration.accordion({
                    collapsible: true,
                    heightStyle: "content"
                });

                return $iteration;
            }

            function addOverride($container, templates, model) {
                var $override = $(mustache.render(templates.expOverride, {}));

                var $objectSelect = $override.find('.exp-object-select');
                var $fieldSelect = $override.find('.exp-field-select');
                var $valueInput = $override.find('.exp-value-input');
                var $addOverrideButton = $override.find('.exp-add-override-button');

                _.each(model.objects, function(object) {
                    $objectSelect.append(new Option(object.name, object.id));
                });

                $addOverrideButton.click(addOverride.bind(this, $container, templates, model));

                $override.appendTo($container);
            }
        }
    );
});