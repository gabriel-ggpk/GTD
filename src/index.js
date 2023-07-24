import {renderer,scene,camera} from './routines/init'
function animate(time) {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
