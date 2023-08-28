import * as THREE from "three";

class Tower {
  constructor(material, geometry, grid) {
    this.instance = new THREE.Mesh(geometry, material);
    this.life = 10;
    this.grid = grid;
    this.target = null;
  }

  spawn(group) {
    group.add(this.instance);
  }

  die(group) {
    group.remove(this.instance);
  }

  getTarget( mobs) {
    let closerDistance = Number.MAX_VALUE;
    mobs.forEach((mob) => {
      const distance = this.instance.position.distanceTo(mob.instance.position);
      if(distance < closerDistance){
        this.target = mob
      }
    });

    if(closerDistance=Number.MAX_VALUE){
        this.target = null 
    }
    else{
        this.target.takeDamage(5)
    }
  }
}
export default Tower;
