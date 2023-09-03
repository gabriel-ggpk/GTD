import * as THREE from "three";

class BasicMob {

    constructor(material,geometry,map,scene){
        this.instance = new THREE.Mesh(geometry,material)
        this.life = 10
        this.map = map.grid
        this.movement = new THREE.Vector3()
        this.position = - 1
        this.scene = scene
    }

    spawn(scene) {
        this.position = this.map.path.length - 1
        this.instance.position.set(this.map.path[this.position][0],1,this.map.path[this.position][1])
        this.movement = new THREE.Vector3(this.map.path[this.position-1][0] - this.map.path[this.position][0],0,this.map.path[this.position-1][1] - this.map.path[this.position][1]) 
        scene.add(this.instance)
    }

    nextStep(){
        --this.position
        if(!this.map.path[this.position-1]){
            this.die();
            return
        }
        this.movement = new THREE.Vector3(this.map.path[this.position-1][0] 
        - this.map.path[this.position][0],0,this.map.path[this.position-1][1] 
        - this.map.path[this.position][1])
    }

    checkStep(){
        const currentSquare = this.instance.position.clone()

        currentSquare.setX(this.movement.x >= 0 ? Math.floor(currentSquare.x) : Math.ceil(currentSquare.x))
        currentSquare.setZ(this.movement.z >= 0 ? Math.floor(currentSquare.z) : Math.ceil(currentSquare.z))
        
        
        if(currentSquare.x == this.map.path[this.position-1]?.[0]
        && currentSquare.z == this.map.path[this.position-1]?.[1]){
            this.instance.position.set(currentSquare.x,1,currentSquare.z)
            this.nextStep()
        }
    }
    
    takeDamage(damage){
        this.life -=damage;
        if(life<=0) this.die()
    }

    die(){
        this.scene.remove(this.instance)
    }
}
export default BasicMob