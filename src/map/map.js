import * as THREE from "three";
import { addGrid, createGrid } from "../utils/createGrid";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Map {

  constructor(size, scene) {
    this.grid = createGrid(size);
    this.size = size;
    this.container = new THREE.Group();
    scene.add(this.container);
    
    this.gltfLoader = new GLTFLoader();

    this.gltfLoader.load("./assets/base/scene.gltf", (base) => {
        base.scene.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true;
          }
        });
        base.scene.position.set(9.5, -0.2, 9.5);
        base.scene.scale.set(0.3, 0.3, 0.3);
        
        scene.add(base.scene);
      });
  }

  addToScene() {
    this.grid.map.forEach((row) => {
      row.forEach((col) => {
        const cube = new THREE.Mesh(col.data.geometry, col.data.material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.set(
          col.data.position[0],
          cube.geometry.parameters.height / 2,
          col.data.position[1]
        );
        cube.layers.enableAll()
        this.container.add(cube);
        const edges = new THREE.EdgesGeometry( col.data.geometry); 
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000 } ) ); 
        cube.add( line );

    });
});

  }

  addSector() {
    addGrid(this.grid, this.size);
    this.container.clear();
    this.addToScene();
  }

  die(scene) {
    scene.remove(this.container);
  }
}
export default Map;
