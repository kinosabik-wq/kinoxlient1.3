import * as THREE from 'three';

export function startMinegoing({mount,onDistance=()=>{},onEnd=()=>{},onStart=()=>{},getShield=()=>0,useShield=()=>false}={}){
 const scene=new THREE.Scene();
 scene.background=new THREE.Color(0x11182a);
 scene.fog=new THREE.Fog(0x11182a,18,75);
 const camera=new THREE.PerspectiveCamera(62,1,.1,120);
 camera.position.set(0,6.3,11.5); camera.lookAt(0,1,-8);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
 renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 mount.innerHTML='';mount.appendChild(renderer.domElement);
 renderer.domElement.style.width='100%';renderer.domElement.style.height='260px';renderer.domElement.style.display='block';renderer.domElement.style.borderRadius='18px';renderer.domElement.style.touchAction='none';
 scene.add(new THREE.HemisphereLight(0xb9d7ff,0x28301f,2.0));
 const sun=new THREE.DirectionalLight(0xffffff,2.1);sun.position.set(-4,10,6);sun.castShadow=true;scene.add(sun);
 const mats={
  grass:new THREE.MeshStandardMaterial({color:0x47744f,roughness:1}),
  dirt:new THREE.MeshStandardMaterial({color:0x624b3b,roughness:1}),
  stone:new THREE.MeshStandardMaterial({color:0x7c8a9a,roughness:.9}),
  player:new THREE.MeshStandardMaterial({color:0x46a878,roughness:.75}),
  head:new THREE.MeshStandardMaterial({color:0xc5a47d,roughness:.8}),
  eye:new THREE.MeshStandardMaterial({color:0x171b28}),
  zombie:new THREE.MeshStandardMaterial({color:0x83a96d}),
  herobrine:new THREE.MeshStandardMaterial({color:0x252333}),
  white:new THREE.MeshStandardMaterial({color:0xe7e7f4})
 };
 const box=(w,h,d,mat,x,y,z)=>{let m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m};
 let world='classic',worldColors={classic:[0x11182a,0x47744f,0x624b3b],nether:[0x321923,0x743d3a,0x4b292c],end:[0x171329,0x4b3c67,0x353044]};
 let ground,sideA,sideB,player,head,eyes=[],pursuer,obstacles=[],decor=[],lane=1,jumpY=0,jumpV=0,score=0,speed=12,spawnTimer=0,dead=false,last=0,raf=0,disposed=false;
 const laneX=[-2.2,0,2.2];
 function makePlayer(){
  player=new THREE.Group();scene.add(player);
  let body=new THREE.Mesh(new THREE.BoxGeometry(.72,.95,.48),mats.player);body.position.y=.8;body.castShadow=true;player.add(body);
  head=new THREE.Mesh(new THREE.BoxGeometry(.62,.62,.58),mats.head);head.position.y=1.58;head.castShadow=true;player.add(head);
  for(let x of [-.16,.16]){let e=new THREE.Mesh(new THREE.BoxGeometry(.09,.09,.035),mats.eye);e.position.set(x,1.64,.3);player.add(e)}
  let legmat=new THREE.MeshStandardMaterial({color:0x29364e});
  for(let x of [-.2,.2]){let leg=new THREE.Mesh(new THREE.BoxGeometry(.22,.48,.25),legmat);leg.position.set(x,.24,0);player.add(leg)}
  player.position.set(0,0,3);
 }
 function makePursuer(){pursuer=new THREE.Group();scene.add(pursuer);let b=new THREE.Mesh(new THREE.BoxGeometry(.9,1.1,.5),mats.herobrine);b.position.y=.8;pursuer.add(b);let h=new THREE.Mesh(new THREE.BoxGeometry(.8,.75,.6),mats.white);h.position.y=1.7;pursuer.add(h);let eyeMat=new THREE.MeshBasicMaterial({color:0xfff7ff});for(let x of [-.2,.2]){let e=new THREE.Mesh(new THREE.BoxGeometry(.11,.08,.04),eyeMat);e.position.set(x,1.75,.32);pursuer.add(e)}pursuer.position.set(0,0,9)}
 function clearScene(){for(let o of [...obstacles,...decor])scene.remove(o);obstacles=[];decor=[]}
 function buildWorld(){
  let colors=worldColors[world];scene.background.setHex(colors[0]);scene.fog.color.setHex(colors[0]);
  if(ground)scene.remove(ground);if(sideA)scene.remove(sideA);if(sideB)scene.remove(sideB);
  ground=new THREE.Mesh(new THREE.BoxGeometry(8,.6,100),new THREE.MeshStandardMaterial({color:colors[1]}));ground.position.set(0,-.35,-35);ground.receiveShadow=true;scene.add(ground);
  let sideMat=new THREE.MeshStandardMaterial({color:colors[2]});
  sideA=new THREE.Mesh(new THREE.BoxGeometry(1,.9,100),sideMat);sideA.position.set(-4.5,-.1,-35);scene.add(sideA);
  sideB=sideA.clone();sideB.position.x=4.5;scene.add(sideB);
  clearScene();
  for(let i=0;i<28;i++){let m=new THREE.Mesh(new THREE.BoxGeometry(.4+Math.random()*.5,.4+Math.random()*1.8,.4),new THREE.MeshStandardMaterial({color:world==='nether'?0x9a514b:world==='end'?0x71628d:0x668c72}));m.position.set((Math.random()>.5?1:-1)*(5+Math.random()*5),.2,-i*3);scene.add(m);decor.push(m)}
 }
 makePlayer();makePursuer();buildWorld();
 function obstacle(){let laneIndex=Math.floor(Math.random()*3),h=.8+Math.random()*1.1,mat=new THREE.MeshStandardMaterial({color:world==='nether'?0xb65d51:world==='end'?0x8c7db5:0x718c77});let mesh=new THREE.Mesh(new THREE.BoxGeometry(.9,h,.9),mat);mesh.position.set(laneX[laneIndex],h/2,-43);mesh.castShadow=true;scene.add(mesh);obstacles.push({mesh,lane:laneIndex,h})}
 function reset(){clearScene();lane=1;jumpY=0;jumpV=0;score=0;speed=12;spawnTimer=0;dead=false;last=0;player.position.set(0,0,3);pursuer.position.z=9;buildWorld();onStart()}
 function jump(){if(dead)return;if(jumpY<.05)jumpV=10}
 function changeLane(d){lane=Math.max(0,Math.min(2,lane+d))}
 function setWorld(w){world=w in worldColors?w:'classic';buildWorld();reset()}
 function resize(){let w=mount.clientWidth||320,h=260;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(mount);resize();
 let sx=0,sy=0;
 const down=e=>{sx=e.clientX;sy=e.clientY};
 const up=e=>{let dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>25)changeLane(dx>0?1:-1);else if(dy<-20)jump();else jump()};
 renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);
 function animate(t){if(disposed)return;raf=requestAnimationFrame(animate);let dt=Math.min((t-last)/1000||.016,.045);last=t;
  if(!dead){score+=dt*speed*.45;speed=Math.min(25,12+score*.018);spawnTimer+=dt;if(spawnTimer>Math.max(.55,1.45-score*.001)){spawnTimer=0;obstacle()}
   obstacles.forEach(o=>o.mesh.position.z+=speed*dt);obstacles=obstacles.filter(o=>{if(o.mesh.position.z>10){scene.remove(o.mesh);return false}return true});
   jumpV-=24*dt;jumpY+=jumpV*dt;if(jumpY<0){jumpY=0;jumpV=0}
   player.position.x+=(laneX[lane]-player.position.x)*Math.min(1,dt*12);player.position.y=jumpY;
   pursuer.position.z=9-Math.min(5,score*.012);
   for(let i=0;i<obstacles.length;i++){let o=obstacles[i],z=o.mesh.position.z;if(Math.abs(z-3)<.75&&o.lane===lane&&jumpY<o.h*.7){if(useShield()){scene.remove(o.mesh);obstacles.splice(i,1);break}else{dead=true;onEnd();break}}}
   onDistance(Math.floor(score));
  }
  player.rotation.z=dead?-.08:Math.sin(t*.012)*.025;
  renderer.render(scene,camera);
 }
 raf=requestAnimationFrame(animate);
 return {jump,setWorld,restart:reset,dispose(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);renderer.dispose();mount.innerHTML=''}};
}
