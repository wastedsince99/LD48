import {CollidableGameObject, Transformation} from "./GameObject.js"
import {level} from "./state.js"
import {MAP_WIDTH, MAP_HEIGHT} from "./generation.js"
import {vec2} from "./gl-matrix-min.js"

function initTileAssets() {
    //TODO init array for tiles. Could be optimized out
}

export const GRID_SIZE = 3;

export function computeSquareMap(scanlineArr) {

    let side_offset = Math.floor(MAP_WIDTH / 2) * GRID_SIZE; //offset cube objects so that they start at the middle
    let depth_offset = GRID_SIZE;

    for (let h = 0; h < MAP_HEIGHT - 1; h++) {
        for (let w = 0; w < MAP_WIDTH - 1; w++) {
            let tl = scanlineArr[w + h * MAP_WIDTH] ? 1 : 0;
            let tr = scanlineArr[w + 1 + h * MAP_WIDTH] ? 1 : 0;
            let bl = scanlineArr[w + (h + 1) * MAP_WIDTH] ? 1 : 0;
            let br = scanlineArr[w + 1 + (h + 1) * MAP_WIDTH] ? 1 : 0;

            let type = tl + tr + bl + br;
            let transform = null;
            let shape = null;
            switch(type) {
                case 0:       //open space
                    break;
                case 1:       //corner
                    if (tl == 1) {
                        transform = Transformation.TOP_LEFT
                        shape = [vec2.fromValues(-0.5 * GRID_SIZE, 0), vec2.fromValues(0, 0.5 * GRID_SIZE)]
                    } else if (tr == 1) {
                        transform = Transformation.TOP_RIGHT
                        shape = [vec2.fromValues(0, 0.5 * GRID_SIZE), vec2.fromValues(0.5 * GRID_SIZE, 0)]
                    } else if (bl == 1) {
                        transform = Transformation.BOTTOM_LEFT
                        shape = [vec2.fromValues(-0.5 * GRID_SIZE, 0), vec2.fromValues(0, -0.5 * GRID_SIZE)]
                    } else if (br == 1) {
                        transform = Transformation.BOTTOM_RIGHT
                        shape = [vec2.fromValues(0, -0.5 * GRID_SIZE), vec2.fromValues(0.5 * GRID_SIZE, 0)]
                    }

                    level.objects.push(new CollidableGameObject(
                        "Segments/0010.png",
                        vec2.fromValues(w * GRID_SIZE - side_offset, -(h * GRID_SIZE + depth_offset)),
                        vec2.fromValues(GRID_SIZE, GRID_SIZE),
                        shape,
                        vec2.fromValues(1, 1),
                        vec2.fromValues(0, 0),
                        transform
                    ));
                    break;
                case 2:       //wall or corridor
                    if ((tl == br) && (tr == bl)) { //corridor
                        // TODO: Fix collision
                        if (Math.random() > 0.5) {
                            level.objects.push(new CollidableGameObject(
                                "Segments/0101_e.png",
                                vec2.fromValues(w * GRID_SIZE - side_offset, -(h * GRID_SIZE + depth_offset)),
                                vec2.fromValues(GRID_SIZE, GRID_SIZE),
                                [],
                                vec2.fromValues(1, 1),
                                vec2.fromValues(0, 0),
                                tl == 1 ? Transformation.TOP_RIGHT : Transformation.TOP_LEFT
                            ));
                        } else {
                            level.objects.push(new CollidableGameObject(
                                "Segments/1010_f.png",
                                vec2.fromValues(w * GRID_SIZE - side_offset, -(h * GRID_SIZE + depth_offset)),
                                vec2.fromValues(GRID_SIZE, GRID_SIZE),
                                [],
                                vec2.fromValues(1, 1),
                                vec2.fromValues(0, 0),
                                tl == 0 ? Transformation.TOP_RIGHT : Transformation.TOP_LEFT
                            ));
                        }
                    }
                    else {
                        if (tl == 1 && tr == 1) {
                            transform = Transformation.TOP_LEFT;
                            shape = [vec2.fromValues(-0.5 * GRID_SIZE, 0), vec2.fromValues(0.5 * GRID_SIZE, 0)];
                        } else if (tr == 1 && br == 1) {
                            transform = Transformation.TOP_RIGHT;
                            shape = [vec2.fromValues(0, -0.5 * GRID_SIZE), vec2.fromValues(0, 0.5 * GRID_SIZE)];
                        } else if (br == 1 && bl == 1) {
                            transform = Transformation.BOTTOM_RIGHT;
                            shape = [vec2.fromValues(-0.5 * GRID_SIZE, 0), vec2.fromValues(0.5 * GRID_SIZE, 0)];
                        } else if (bl == 1 && tl == 1) {
                            transform = Transformation.BOTTOM_LEFT;
                            shape = [vec2.fromValues(0, -0.5 * GRID_SIZE), vec2.fromValues(0, 0.5 * GRID_SIZE)];
                        }

                        level.objects.push(new CollidableGameObject(
                            "Segments/0011.png",
                            vec2.fromValues(w * GRID_SIZE - side_offset, -(h * GRID_SIZE + depth_offset)),
                            vec2.fromValues(GRID_SIZE, GRID_SIZE),
                            shape,
                            vec2.fromValues(1, 1),
                            vec2.fromValues(0, 0),
                            transform
                        ));
                    }
                    break;
                case 3:       //inverted corner
                    if (tl == 0) {
                        transform = Transformation.TOP_LEFT
                        shape = [vec2.fromValues(-0.5 * GRID_SIZE, 0), vec2.fromValues(0, 0.5 * GRID_SIZE)]
                    } else if (tr == 0) {
                        transform = Transformation.TOP_RIGHT
                        shape = [vec2.fromValues(0, 0.5 * GRID_SIZE), vec2.fromValues(0.5 * GRID_SIZE, 0)]
                    } else if (bl == 0) {
                        transform = Transformation.BOTTOM_LEFT
                        shape = [vec2.fromValues(-0.5 * GRID_SIZE, 0), vec2.fromValues(0, -0.5 * GRID_SIZE)]
                    } else if (br == 0) {
                        transform = Transformation.BOTTOM_RIGHT
                        shape = [vec2.fromValues(0, -0.5 * GRID_SIZE), vec2.fromValues(0.5 * GRID_SIZE, 0)]
                    }

                    level.objects.push(new CollidableGameObject(
                        "Segments/0111.png",
                        vec2.fromValues(w * GRID_SIZE - side_offset, -(h * GRID_SIZE + depth_offset)),
                        vec2.fromValues(GRID_SIZE, GRID_SIZE),
                        shape,
                        vec2.fromValues(1, 1),
                        vec2.fromValues(0, 0),
                        transform
                    ));
                    break;
                case 4:       //solid wall
                    level.objects.push(new CollidableGameObject(
                        "Segments/1111.png",
                        vec2.fromValues(w * GRID_SIZE - side_offset, -(h * GRID_SIZE + depth_offset)),
                        vec2.fromValues(GRID_SIZE, GRID_SIZE),
                        [],
                        vec2.fromValues(1, 1),
                        vec2.fromValues(0, 0),
                        transform
                    ));
                    break;
            }
        }
    }
}
