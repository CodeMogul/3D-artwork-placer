// import * as THREE from './threejs/three.module.js';
// import { OrbitControls } from './threejs/OrbitControls.js';
// import * as Crop from './crop.js';

const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
const loader2 = new THREE.TextureLoader();

// const materials = [
//   new THREE.MeshBasicMaterial({ map: loader.load('resources/1.jpg') }),
//   new THREE.MeshBasicMaterial({ map: texture }),
//   new THREE.MeshBasicMaterial({ map: loader.load('resources/eye.jpg') }),
//   new THREE.MeshBasicMaterial({ map: loader.load('resources/facebook.png') }),
//   new THREE.MeshBasicMaterial({ map: loader.load('resources/pintrest.png') }),
//   new THREE.MeshBasicMaterial({ map: loader.load('resources/windows.png') }),
// ];

const materials = [
  new THREE.MeshBasicMaterial({color: 0xa97835}),
  new THREE.MeshBasicMaterial({color: 0xa97835}),
  new THREE.MeshBasicMaterial({color: 0x000000}),
  new THREE.MeshBasicMaterial({color: 0xa97835}),
  new THREE.MeshBasicMaterial({color: 0xa97835}),
  new THREE.MeshBasicMaterial({color: 0xa97835}),
];

var canvas = document.getElementById("canvas3d");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, canvas.innerWidth / canvas.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.innerWidth, canvas.innerHeight);

camera.position.set( -4, 4, 10 );

function createLights() {

  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // sky color
    0x202020, // ground color
    5, // intensity
  );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 2 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

}
// createLights();


var domEvents = new THREEx.DomEvents(camera, renderer.domElement)

let cube = null;

let controls = new OrbitControls(camera, renderer.domElement);
//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 5;
controls.maxPolarAngle = Math.PI;

var selectedFaceIndex = -1;

var geometry = new THREE.CubeGeometry(1, 1.8, 0.5);
cube = new THREE.Mesh(geometry, materials);
camera.position.z = 5;
scene.add(cube);
domEvents.addEventListener(cube, 'click', function (event) {
  const index = event.intersect.face.materialIndex;
  const color = event.target.material[index].map ? 0xffffff : 0xa97835;
  if (index === selectedFaceIndex) {
    event.target.material[selectedFaceIndex].color.set(color);
    selectedFaceIndex = -1;
  }
  else {
    if (selectedFaceIndex !== -1) {
      event.target.material[selectedFaceIndex].color.set(color);
    }
    selectedFaceIndex = event.intersect.face.materialIndex;
    event.target.material[selectedFaceIndex].color.set(0x4287f5)
  }
}, false)

// loadManager.onLoad = () => {
// }

var animate = function () {
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  controls.update();
  // light.position.copy( camera.position );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

animate();

const textures = {};
const faceToImageMap = {};

function setTexture() {
  if (selectedFaceIndex < 0) return;

  const image = getSelectedImageData();
  if (!(image.id in textures)) textures[image.id] = loader2.load(image.data);
  textures[image.id].center.set(.5, .5);

  cube.material[selectedFaceIndex].map = textures[image.id];
  // cube.material[selectedFaceIndex].map.needsUpdate = true;
  cube.material[selectedFaceIndex].needsUpdate = true;
  faceToImageMap[selectedFaceIndex] = image.id;

  cube.material[selectedFaceIndex].color.set(0xffffff);
  selectedFaceIndex = -1;
}

function rotate() {
  if(!(selectedFaceIndex in faceToImageMap)) return;

  const angle = parseInt(document.getElementById('angleInput').value || 10);
  textures[faceToImageMap[selectedFaceIndex]].rotation += THREE.Math.degToRad(angle);
  textures[faceToImageMap[selectedFaceIndex]].needsUpdate = true;
}

document.getElementById("myBtn").addEventListener("click", rotate);
document.getElementById("setBtn").addEventListener("click", setTexture);