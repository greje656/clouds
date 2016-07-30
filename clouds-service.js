/**
 * @module
 */
define(['services/marshalling-service', 'services/engine-service', 'services/file-system-service', 'services/project-service'
], function (marshallingService, engineService, fileSystemService, projectService) {
    "use strict";

    var CloudsService = {
    };

    function createClouds (levelEditingService) {
        marshallingService.invokeMethod(levelEditingService, 'SpawnEntity', 'Clouds', 'clouds-resources/clouds').then(function () {
            console.log('cloud entity spawned');

            engineService.sendToLocalEditors(`
                require "clouds-resources/clouds"
                local result = Clouds:generate()
                print("Cloud generated", result)
            `).then(console.warn.bind(console, "Clouds generated"));
        });
    }

    marshallingService.requestRemoteObject('Stingray.LevelEditingService').then(function (levelEditingService) {
        levelEditingService.on('InitializeEngineDevice', function (args) {
            createClouds(levelEditingService);
        });
    });

    return CloudsService;
});