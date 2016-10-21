/**
 * Clouds editor module.
 * @module
 */
define([
    'lodash',
    'services/engine-service',
    'services/project-service',
    'services/file-system-service'
], function (_) {
    "use strict";
    
    /** @type {FileSystemService} */
    const fs = require('services/file-system-service');
    
    /** @type {EngineService} */
    const engineService = require('services/engine-service');
    
    /** @type {ProjectService} */
    const projectService = require('services/project-service');
    
    const CLOUDS_RENDER_CONFIG_NAME = "clouds-resources/clouds";
    
    /**
     * Get the project root path.
     * @returns {Promise.<string>}
     */
    function getProjectPath() {
        return projectService.getCurrentProjectPath();
    }
    
    function getEngineSettingsFilePath() {
        return getProjectPath().then(function (projectPath) {
            return fs.join(projectPath, "settings.ini");
        });
    }
    
    /**
     * Get project engine settings.
     * @return {Promise.<object>} SJSON of the engine settings.
     */
    function getEngineSettings() {
        return getEngineSettingsFilePath().then(function (engineSettingsFilePath) {
            return fs.readJSON(engineSettingsFilePath);
        });
    }
    
    /**
     * Checks if the projects contains the clouds render config.
     */
    function checkCloudsRenderConfigExtension () {
        return getEngineSettings().then(function (engineSettings) {
            /** @type {string[]} */
            let renderConfigExtensions = engineSettings.render_config_extensions;
            if (!_.isArray(renderConfigExtensions))
                return false;
            
            return renderConfigExtensions.indexOf(CLOUDS_RENDER_CONFIG_NAME) >= 0;
        });
    }
    
    /**
     * Saves settings to the engine settings.ini file.
     * @param {object} engineSettings - Settings to be saved.
     * @return {Promise} Resolves when the file is saved.
     */
    function saveEngineSettings(engineSettings) {
        return getEngineSettingsFilePath().then(function (engineSettingsFilePath) {
            return fs.writeJSON(engineSettingsFilePath, engineSettings);
        });
    }
    
    /**
     * Make sure the project settings.ini contains the clouds render config.
     * @return {Promise} Resolves when the project engine settings contains the clouds render config.
     */
    function setupRenderConfigExtension () {
        return checkCloudsRenderConfigExtension().then(function (exists) {
            if (exists)
                return;
            
            // Add the clouds render config extension to the settings.ini
            //
            console.info('Adding clouds render config extension to engine settings (`settings.ini`)');
            return getEngineSettings().then(function (engineSettings) {
                engineSettings.render_config_extensions = engineSettings.render_config_extensions || [];
                engineSettings.render_config_extensions.push(CLOUDS_RENDER_CONFIG_NAME);
                return saveEngineSettings(engineSettings);
            }).then(function () {
                return engineService.compile();
            }).then(function () {
                // TODO: Ideally the engine API would allow us to refresh
                // render config extensions instead of killing the engine and restart it.
                return engineService.restartEditorEngine();
            });
        });
    }
    
    /**
     * Add a clouds entity to the current level.
     * @param {LevelEditingService} levelEditingService - used to spawn the entity into the current level.
     * @return {Promise} Resolves when the clouds entity is added to the level.
     */
    function createClouds (levelEditingService) {
        // TODO: Check if a clouds entity already exists in the current level?
        return levelEditingService.invoke('SpawnEntity', 'Clouds', 'clouds-resources/clouds').then(function () {
            return engineService.sendToLocalEditors(`
                require "clouds-resources/clouds"
                local result = Clouds:generate()
            `).then(console.debug.bind(console, "Clouds generated"));
        });
    }
    
    /**
     * Clouds editor module.
     * @namespace
     * @type {object}
     */
    var Clouds = {};
    
    Clouds.createClouds = function () {
        return setupRenderConfigExtension().then(function () {
            return Promise.require(['services/level-editing-service'])
            .spread(function (levelEditingService) {
                return createClouds(levelEditingService);
            });
        });
    };

    return Clouds;
});
