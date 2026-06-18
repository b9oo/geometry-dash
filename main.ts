// main.ts for Geometry Dash MakeCode Arcade Extension
// Add to your project via GitHub URL once hosted, or copy-paste into a custom extension

namespace geometrydash {
    // =============================================
    // Tile definitions (use with tilemaps)
    // =============================================
    export const Tile = {
        Spike: 1,
        Platform: 2,
        GravityPortal: 3,
        SpeedPortal: 4,
        Orb: 5,
        Pad: 6,
        Hazard: 7
    };

    // Predefined tiles (you can override or use your own images)
    //% blockId=gd_set_tiles
    //% block="set Geometry Dash tiles"
    //% group="Tiles"
    export function setGDTiles() {
        // Example tiles - replace with actual 16x16 pixel art in editor
        scene.setTile(1, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, true); // Spike - solid + deadly
        // Add more tiles similarly...
        console.log("GD Tiles set - customize in tilemap editor!");
    }

    // =============================================
    // Player / Gamemode system
    // =============================================
    export enum GameMode {
        Cube,
        Ship,
        Ball,
        UFO,
        Wave,
        Robot
    }

    let currentMode = GameMode.Cube;
    let player: Sprite = null;
    let gravity = 1;
    let velocityY = 0;
    let isOnGround = true;

    //% block="set player to $sprite in mode $mode"
    //% sprite.shadow="variables_get"
    //% mode.defl=GameMode.Cube
    //% group="Gamemodes"
    export function setPlayerMode(sprite: Sprite, mode: GameMode) {
        player = sprite;
        currentMode = mode;
        sprite.setKind(SpriteKind.Player);
        
        // Basic setup
        if (mode === GameMode.Cube) {
            sprite.setVelocity(0, 0);
        } else if (mode === GameMode.Ship) {
            gravity = 0.3; // lighter gravity
        }
        // etc.
    }

    //% block="change gamemode to $mode"
    //% mode.defl=GameMode.Ship
    //% group="Gamemodes"
    export function changeGameMode(mode: GameMode) {
        if (!player) return;
        currentMode = mode;
        // Visual change or animation could go here
        console.log("Gamemode changed to " + mode);
    }

    // Main update loop handler
    game.onUpdate(function() {
        if (!player) return;
        
        switch(currentMode) {
            case GameMode.Cube:
                handleCube();
                break;
            case GameMode.Ship:
                handleShip();
                break;
            case GameMode.Ball:
                handleBall();
                break;
            // Add more...
        }
        
        // Collision with hazards
        if (player.overlaps(scene.getTilesOfKind(1)) || player.overlaps(scene.getTilesOfKind(7))) {
            game.over();
        }
    });

    function handleCube() {
        // Jump on A press
        if (controller.A.isPressed() && isOnGround) {
            velocityY = -150;
            isOnGround = false;
        }
        // Apply gravity
        velocityY += 8;
        player.vy = velocityY;
    }

    function handleShip() {
        if (controller.A.isPressed()) {
            player.vy = -80;
        } else {
            player.vy = 60;
        }
    }

    function handleBall() {
        if (controller.A.isPressed()) {
            gravity = -gravity;
        }
        player.vy += gravity * 5;
    }

    // Add similar handlers for UFO (tap jumps), Wave (angle control), etc.

    // =============================================
    // Level helpers
    // =============================================
    //% block="create GD level with tilemap $map"
    //% map.shadow="tilemap_editor"
    //% group="Levels"
    export function createGDLevel(map: tiles.TileMapData) {
        tiles.setTilemap(map);
        // Auto-place player, set camera follow, etc.
        scene.cameraFollowSprite(player);
    }

    //% block="add jump orb at $col $row"
    //% group="Objects"
    export function addOrb(col: number, row: number) {
        // Create sprite orb that gives boost on contact
    }
}

// Example usage in a project (copy this to on start):
/*
geometrydash.setGDTiles();
let myPlayer = sprites.create(img`[your cube sprite]`, SpriteKind.Player);
geometrydash.setPlayerMode(myPlayer, geometrydash.GameMode.Cube);

// Create a simple level tilemap in the editor
geometrydash.createGDLevel(tilemap`level1`);
controller.moveSprite(myPlayer, 100, 0); // horizontal movement
*/
