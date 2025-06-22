/***********************************************************/
//
//game.js
//
//by Aston Noble term 2 2025 
//
/***********************************************************/



/***********************************************************/
//giving attributes
/***********************************************************/

document.querySelector('#jim').setAttribute('look-at-player', '');
document.querySelector('#jim').setAttribute('heatseeker', '');
document.querySelector('#gun').setAttribute('gunanim', '');
mesh.setAttribute('src','./glb/nav/navmesh0.glb');

let enems = document.querySelectorAll('#enemy')
for(let i=0; i< enems.length; i++) {
    enems[i].setAttribute('enemys', '')
}

/***********************************************************/
//variables and constants
/***********************************************************/

let health = 6
const doorid = [1,2,5,6,7,8]
const doorspawn = [5.5,2,-2,15.5,2,15.5]

/***********************************************************/
//door(i,spawn,type)
//
//opens and closes the doors
//inputs
//i      --> door number
//spawn  --> spawn along type axis
//type   --> axis of door
/***********************************************************/

async function door(i,spawn,type) {
    i = i * 2
    let doorA = document.getElementById("door" + String(i-1))
    let doorB = document.getElementById("door" + String(i))
    let doorAPos = doorA.getAttribute('position')
    let doorBPos = doorB.getAttribute('position')
    let pos1
    let pos2
    if (type == 'x') {
        if (doorAPos.x == spawn) {
            pos1 = ((doorAPos.x + 1.5) + ' ' + doorAPos.y + ' ' + doorAPos.z)
            pos2 = ((doorBPos.x - 1.5) + ' ' + doorBPos.y + ' ' + doorBPos.z)
            await mesh.setAttribute('src','./glb/nav/navmesh'+i+'.glb')
        } else {
            pos1 = (spawn + ' ' + doorAPos.y + ' ' + doorAPos.z)
            pos2 = (spawn + ' ' + doorBPos.y + ' ' + doorBPos.z)
            await mesh.setAttribute('src','./glb/nav/navmesh0.glb')
        }
    } else {
        if (doorAPos.z == spawn) {
            pos1 = ((doorAPos.x) + ' ' + doorAPos.y + ' ' + (doorAPos.z + 1.5))
            pos2 = ((doorBPos.x) + ' ' + doorBPos.y + ' ' + (doorBPos.z - 1.5))
            await mesh.setAttribute('src','./glb/nav/navmesh'+i+'.glb')
        } else {
            pos1 = (doorAPos.x + ' ' + doorAPos.y + ' ' + spawn)
            pos2 = (doorBPos.x + ' ' + doorBPos.y + ' ' + spawn)
            await mesh.setAttribute('src','./glb/nav/navmesh0.glb')
        }
    }
    doorA.setAttribute('animation', {property: 'position', to: pos1, dur: '1000', startEvents: 'lod'});
    doorB.setAttribute('animation', {property: 'position', to: pos2, dur: '1000', startEvents: 'lod'});
    doorA.emit('lod')
    doorB.emit('lod')
    for (let y = 1; y<(doorid.length/2 + 1); y++) {
        if (doorid[y*2-1] != i) {
            var pos = (doorspawn[y*2-1-1] + ' ' + document.getElementById("door" + String(doorid[y*2-1-1])).getAttribute('position').y + ' ' + doorspawn[y*2-1])
            document.getElementById("door" + String(doorid[y*2-1-1])).setAttribute('animation', {property: 'position', to: pos, dur: '1000', startEvents: 'lod'})
            document.getElementById("door" + String(doorid[y*2-1])).setAttribute('animation', {property: 'position', to: pos, dur: '1000', startEvents: 'lod'})
            document.getElementById("door" + String(doorid[y*2-1-1])).emit('lod')
            document.getElementById("door" + String(doorid[y*2-1])).emit('lod')
            console.log("door" + String(doorid[y*2-1]) + pos)
            console.log("door" + String(doorid[y*2-1-1]))
        }
    }
}

/***********************************************************/
//finish(i,spawn,type)
//
//triggers when player wins the game
//inputs
//gets put into door(i,spawn,type)
/***********************************************************/

async function finish(i,spawn,type) {
    if (i==5) {
    door(i,spawn,type)
    await new Promise(r => setTimeout(r, 300));
    end.setAttribute('visible',true)
    await new Promise(r => setTimeout(r, 3000));
    window.location.replace('./index.html')
    
    
    } else {
    popup.setAttribute('visible',true)
    await new Promise(r => setTimeout(r, 3000));
    popup.setAttribute('visible',false)
    }

}

/***********************************************************/
//death()
//
//runs player death
/***********************************************************/

async function death() {
    end.setAttribute('src','./images/losescreen.png')
    end.setAttribute('visible',true)
    await new Promise(r => setTimeout(r, 3000));
    window.location.replace('./index.html')
}

/***********************************************************/
//making attributes
/***********************************************************/

AFRAME.registerComponent('heatseeker', {
    schema:{},
    init: async function () {
      const player = document.querySelector('#player');
      const homer = (player.getAttribute('position').x + " " + player.getAttribute('position').y + " " + player.getAttribute('position').z)
      this.el.setAttribute('animation',{property: 'position', to: homer, dur: '1000', startEvents: 'lod'})
      this.el.emit('lod')
      this.el.setAttribute('look-at-player', '');
      this.el.addEventListener("collide", (e) => {
        this.el.remove()
        if (e.detail.body.el.getAttribute('id') == 'player') {
            health--
            document.querySelector('#healthbar').setAttribute('src','./images/healthbar' + health + '.png')
            if (health <= 0) {
    health--
death()
        }
        }
      });
    },
    tick:function () {},
    remove: async function () {
        await new Promise(r => setTimeout(r, 3000));
        let closer = []
      const player = document.querySelector('#player');
      const target = document.querySelectorAll('#enemy');
      for (let i = 0; i < target.length; i++) {
      if (!player || !target) return;

      const playerPos = player.object3D.position;
      const targetPos = target[i].object3D.position;
      const distance = playerPos.distanceTo(targetPos);
      closer[i] = distance
      }
      const distance = Math.min(...closer)
      let enemy
      console.log('Distance:', distance.toFixed(2));
      for (let i = 0; i< closer.length; i++) {
        if (closer[i] == distance) {
            enemy = i
        }
      }
      let enemypos = (target[enemy].getAttribute('position').x + " " + (target[enemy].getAttribute('position').y + 0.5) + " " + target[enemy].getAttribute('position').z) 
      
    const scene = document.querySelector('a-scene');
        const box = document.createElement('a-gltf-model');
        box.setAttribute('position', enemypos);
        box.setAttribute('src', './glb/enemy/spike.glb');
        box.setAttribute('scale', '0.5 0.5 0.5');
        box.setAttribute('id','jim')
        box.setAttribute('kinematic-body', '');
        scene.appendChild(box);
        box.setAttribute('heatseeker', '');
    

    }
})
AFRAME.registerComponent('enemys', {
    init: function() {
        this.el.addEventListener('click', (e) => {
            this.el.remove()
            document.querySelector('#gun').removeAttribute('gunanim')
        document.querySelector('#gun').setAttribute('gunanim', '');
        })
    }
})
AFRAME.registerComponent('distance-checker', {
    tick: function () {
          if (document.getElementById('jim')) {

            } else {

            
            let closer = []
      const player = document.querySelector('#player');
      const target = document.querySelectorAll('#enemy');
      for (let i = 0; i < target.length; i++) {
      if (!player || !target) return;

      const playerPos = player.object3D.position;
      const targetPos = target[i].object3D.position;

      const distance = playerPos.distanceTo(targetPos);
      closer[i] = distance
      }
      const distance = Math.min(...closer)
      let enemy
      console.log('Distance:', distance.toFixed(2));
      for (let i = 0; i< closer.length; i++) {
        if (closer[i] == distance) {
            enemy = i
        }
      }
      let enemypos = (target[enemy].getAttribute('position').x + " " + (target[enemy].getAttribute('position').y + 1) + " " + target[enemy].getAttribute('position').z) 
      
    const scene = document.querySelector('a-scene');
        const box = document.createElement('a-gltf-model');
        box.setAttribute('position', enemypos);
        box.setAttribute('src', './glb/enemy/spike.glb');
        box.setAttribute('scale', '0.5 0.5 0.5');
        box.setAttribute('id','jim')
        box.setAttribute('kinematic-body', '');
        //scene.appendChild(box);
        //box.setAttribute('heatseeker', '');
    }
    
}
  });
AFRAME.registerComponent('look-at-player', {
    update: function () {
      const player = document.querySelector('#player');
      if (!player) return;

      const playerPos = player.object3D.position;
      this.el.object3D.lookAt(playerPos);
    }
  });
AFRAME.registerComponent('gunanim', {
    update: async function() {
        await this.el.setAttribute('src','./glb/gun/gunb.glb')
        await new Promise(r => setTimeout(r, 500));
        await this.el.setAttribute('src','./glb/gun/gunc.glb')
        await new Promise(r => setTimeout(r, 500));
        await this.el.setAttribute('src','./glb/gun/gund.glb')
        await new Promise(r => setTimeout(r, 500));
        this.el.setAttribute('src','./glb/gun/guna.glb')
    }
})

    