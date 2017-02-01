# clouds

Volumetric Clouds plugin for Stingray

## How to use:
Quick video showing this in action:
https://www.youtube.com/watch?v=lZ1i3b5fa5U

1. Copy clouds-resources directory into the root of your Stingray project folder
2. Make sure the settings.ini has a line pointing out the `render_config_extension` file like this:
    ```
    render_config_extensions = [ "clouds-resources/clouds" ]
    ```
3. Drag a clouds entity in the scene

Known limitation: autoload needs to be set to 'true' in settings.ini when launching a project with clouds in it.
