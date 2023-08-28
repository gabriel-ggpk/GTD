import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Map from "../map/map";
const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0xffffff, 0.002);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(20, 20, 20);

const map = new Map(20,scene);
map.addToScene()

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

window.addEventListener('resize', function()
  {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxPolarAngle = Math.PI / 2.5;
orbit.screenSpacePanning = false;
orbit.minDistance = 5



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



export {scene,camera,orbit,renderer,map}