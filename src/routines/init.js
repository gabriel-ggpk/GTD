import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import createMapGrid from "../utils/createGrid";
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.002);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(40, 20, 0);
const grid = createMapGrid(20, 20);

grid.forEach((row, rowIndex) => {
  row.forEach((col, colIndex) => {
    const cube = new THREE.Mesh(col.data.geometry, col.data.material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set(rowIndex, cube.geometry.parameters.height / 2, colIndex);
    scene.add(cube);
  });
});



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

window.addEventListener('resize', function()

    {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });


const orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxPolarAngle = Math.PI / 2.5;
orbit.screenSpacePanning = false;
orbit.minDistance = 5

const gltfLoader = new GLTFLoader();
gltfLoader.load("./assets/base/scene.gltf", (base) => {
  base.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });
  base.scene.position.set(9.5, -0.2, 9.5);
  base.scene.scale.set(0.3, 0.3, 0.3);

  scene.add(base.scene);
});

const groundGeo = new THREE.PlaneGeometry(10000, 10000);
const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });

const ground = new THREE.Mesh(groundGeo, groundMat);
 ground.position.y = 0.7;
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

//ambient light
const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.2);
scene.add(hemiLight);
const directionalLight = new THREE.DirectionalLight(0xfdfbd3, 0.4);
directionalLight.castShadow = true;
directionalLight.position.set(10,100,-200);


directionalLight.target.position.set(10,1,10);
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.mapSize.set(4096, 4096);

directionalLight.target.updateMatrixWorld();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

orbit.update();

export {scene,camera,orbit,renderer}