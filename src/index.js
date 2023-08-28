import BasicMob from './entities/basicMob/basicMob';
import Tower from './entities/tower/tower';
import {renderer,scene,camera,map} from './routines/init'
import * as THREE from "three";

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
raycaster.layers.set(1)
let clock = new THREE.Clock();
let spawnTime = 0;
let delta = 0;
let speed = 2000; // units a second - 2 seconds


const mobs = []

let rollOverMesh, rollOverMaterial;
const rollOverGeo = new THREE.BoxGeometry( 1, 1, 1 );
				rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
				rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
				scene.add( rollOverMesh );

function animate() {
  	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );
  delta = clock.getDelta();
  spawnTime += delta;
  if(spawnTime >= 1){
    const mob = new BasicMob(
      new THREE.MeshStandardMaterial({
        color: 0x600000,
      }),
       new THREE.BoxGeometry(
        0.8,
        0.8,
        0.8
      ),
      map,scene)
      mobs.push(mob)
      mob.spawn(scene)
      spawnTime = 0
  }
  mobs.forEach((mob) =>{

    mob.instance.position.addScaledVector(mob.movement,delta*10)
    mob.checkStep()
  })
   
  

 
  renderer.render(scene, camera);
  
}

renderer.setAnimationLoop(animate);



window.addEventListener( 'mousemove', onPointerMove );
document.addEventListener( 'mousedown', onPointerDown );
function onPointerDown( event ) {
  const intersects = raycaster.intersectObjects( scene.children );
  if ( intersects.length > 0 ) {

    const intersect = intersects[ 0 ];
    const tower = new Tower( new THREE.MeshStandardMaterial({
      color: 0x70af20,
    }),
     new THREE.BoxGeometry(
      1,
      1,
      1))
      tower.instance.position.copy( intersect.point ).addScalar(0.5).floor()
      tower.spawn(map.container)


  }
  
}
function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
  pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects( scene.children );
  if ( intersects.length > 0 ) {

    const intersect = intersects[ 0 ];

    rollOverMesh.position.copy( intersect.point ).addScalar(0.5).floor()


  }

}
