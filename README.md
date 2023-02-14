# Visual Studio Code Extension for HobbyFarm
When providing an IDE (Code-Server) to the user we can control several things in the IDE via this simple API.

## API Endpoints
The plugin will create an endpoint at `localhost:7331` providing several available functionalities

### `/goto` Jump to line
* `file`: Path to the file
* `line`: Number of the line (Input `1` equals Line 1)

### `/goto/position` Jump to position (and optionally select text)
* `file`: Path to the file
* `start`
    * `line` Line Number of position
    * `char` Character in the line: `0` is the start of the line.
* `end` [optional] - if a selection should be made
    * `line` Select until line. 
    * `char` Select until char. `0` is the start of the line.

### `/goto/match`
*Currently not implemented* 

### `replace/position` Replace contents at a specific position
Same input parameters as `goto/position` with extra parameter `text` for the text that should be placed at the position or replace the selection made.

### `/replace/match`
*Currently not implemented* 

### More
See `src/extension.ts` for more info about the input parameters.

## Release Notes
### 1.0.0

Initial release of HobbyFarm API for VSCode

---
