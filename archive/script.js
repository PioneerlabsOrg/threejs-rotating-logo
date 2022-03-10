import './style.css'
import {
    AmbientLight,
    AnimationMixer,
    AxesHelper,
    Box3,
    Cache,
    DirectionalLight,
    GridHelper,
    HemisphereLight,
    LinearEncoding,
    LoaderUtils,
    LoadingManager,
    PMREMGenerator,
    PerspectiveCamera,
    REVISION,
    Scene,
    SkeletonHelper,
    UnsignedByteType,
    Vector3,
    WebGLRenderer,
    sRGBEncoding,
} from 'three';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const MANAGER = new LoadingManager();
const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
const DRACO_LOADER = new DRACOLoader( MANAGER ).setDecoderPath( `${THREE_PATH}/examples/js/libs/draco/gltf/` );
const KTX2_LOADER = new KTX2Loader( MANAGER ).setTranscoderPath( `${THREE_PATH}/examples/js/libs/basis/` );
var state = {

    background: false,
    playbackSpeed: 1.0,
    actionStates: {},
    wireframe: false,
    skeleton: false,
    grid: false,

    // Lights
    addLights: true,
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


//var camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// Load the Orbitcontroller
var controls = new OrbitControls( camera, renderer.domElement );

camera.lookAt(0,0,0);
//camera.position.set(5, 0, 10);
/* controls.dispose(); */
controls.update();

// Load Light
// var directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
// directionalLight.position.set(20, 30, 30).normalize();
// scene.add( directionalLight );


const hemiLight = new HemisphereLight();
hemiLight.name = 'hemi_light';
scene.add(hemiLight);

const light1  = new AmbientLight(state.ambientColor, state.ambientIntensity);
light1.name = 'ambient_light';
scene.add( light1 );

const light2  = new DirectionalLight(state.directColor, state.directIntensity);
light2.position.set(0.4, 0, 0.866); // ~60º
light2.name = 'main_light';
scene.add( light2 );

//the camera rotation pivot
var orbit = new THREE.Object3D();
orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
//orbit.position.copy( mesh.position );

scene.add(orbit );

 document.addEventListener('mousemove', function(e){
    let scale = -0.0002;
    orbit.rotateY( e.movementX * scale );
    //orbit.rotateX( e.movementY * scale );

    // orbit.rotateX( 180 );
    orbit.rotation.z = 0; //this is important to keep the camera level..
});

let cameraDistance = 10;
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
    // object.scale.set( 0.5, 0.5, 0.5 );
  //  object.position.x = 0;//Position (x = right+ left-)
    //object.position.y = 0; //Position (y = up+, down-)
    //object.position.z = 0;//Position (z = front +, back-)


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

















function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

/**
 * Renderer
 */


/**
 * Animate
 */

/*
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
*/
//tick()