import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GrassShaderMaterial } from '../materials/MaterialsGrassStart.js';
import { shadersMap, loadShader } from '../ShaderGrassStart.js';
import { GrassField } from './grass.js';

console.log( "Three JS Ready " + THREE.REVISION )

let camera;
let scene;
let renderer;

let box;
let grassField;

loadShader( start );

function init(){

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
	camera.position.z = 4;
    //camera.position.x = 1.5;
    camera.position.y = 1.5;
    camera.lookAt( new THREE.Vector3(0, 0, 0) );

	scene = new THREE.Scene();

    const group = new THREE.Group();
	scene.add( group );

    const gridHelper = new THREE.GridHelper( 10, 10 );
    scene.add( gridHelper );

    grassField = new GrassField();
    scene.add( grassField );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 2;
	controls.maxDistance = 40;

    

    window.addEventListener( 'resize', onWindowResize );

}

function start(){
    init();
    animate();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate( deltaTime ) {

    requestAnimationFrame( animate );
    render( deltaTime );

}

function render( dt ){

   //box.rotation.y += 0.01;

    if( grassField ){
        grassField.update( dt )
    }
    renderer.render( scene, camera );
}
