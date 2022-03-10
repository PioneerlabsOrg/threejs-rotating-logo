import './style.css'
import {
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    LoadingManager,
    sRGBEncoding,
} from 'three';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const MANAGER = new LoadingManager();
var state = {

    exposure: 1.0,
    textureEncoding: 'sRGB',
    ambientIntensity: 0.3,
    ambientColor: 0xFFFFFF,
    directIntensity: 0.8 * Math.PI, // TODO(#116)
    directColor: 0xFFFFFF,
    bgColor1: '#ffffff',
    bgColor2: '#353535'
};


// Canvas
const canvas = document.querySelector('canvas.webgl')


// Create a scnene
const scene = new THREE.Scene();

// Load a Renderer
//var renderer = new THREE.WebGLRenderer({ alpha: false });
var renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(1000, 500);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;

document.body.appendChild(renderer.domElement);

// Load Camera Perspective
var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 10000);

// Load the Orbitcontroller
var controls = new OrbitControls( camera, renderer.domElement );

camera.lookAt(0,0,0);
controls.update();

// Load Light
var directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
directionalLight.position.set(20, 30, 30).normalize();
scene.add( directionalLight );

var hemiLight = new HemisphereLight();
hemiLight.name = 'hemi_light';
scene.add(hemiLight);

var light1  = new AmbientLight(state.ambientColor, state.ambientIntensity);
light1.name = 'ambient_light';
scene.add( light1 );

var light2  = new DirectionalLight(state.directColor, state.directIntensity);
light2.position.set(0.4, 0, 0.866); // ~60º
light2.name = 'main_light';
scene.add( light2 );

//the camera rotation pivot
var orbit = new THREE.Object3D();
orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
scene.add(orbit );

 document.addEventListener('mousemove', function(e){
    let scaleY = -0.0002;
    let scaleX = -0.0004;
    orbit.rotateY( e.movementX * scaleY );
    orbit.rotateX( e.movementY * scaleX );
    orbit.rotation.z = 0; //this is important to keep the camera level..
});

let cameraDistance = 50;//increase decrease this value to make the logo bigger or smaller
camera.position.z = cameraDistance;
orbit.add( camera );

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}
animate();


const gltfLoader = new GLTFLoader( MANAGER )


gltfLoader.load('logo.glb', (gltf) => {
    var object = gltf.scene || gltf.scenes[0];
    //uncomment this if you want to add material to the object
    // var materialObj = new THREE.MeshPhongMaterial({
    //     color: 0x2C3539,
    //     emissive: 0x2C3539,
    //
    //     shininess: 15,
    //     specular: 0x2C3539
    // })
    // object.traverse(function(child){
    //   if (child instanceof THREE.Mesh){
    //     child.material = materialObj;
    //   }
    // });


    scene.add( object );
});













