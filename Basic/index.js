import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


console.log( "Three JS Ready " + THREE.REVISION )


let camera;
let scene;
let renderer;

let box;

init();
animate();


function init(){

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 5;
    camera.position.y = 5;

	scene = new THREE.Scene();

    const group = new THREE.Group();
	scene.add( group );

    const helper = new THREE.GridHelper( 10, 10 );
	helper.rotation.x = Math.PI / 2;
	group.add( helper );
    helper.visible = false;


    const boxGeo = new THREE.BoxGeometry( 1, 1, 1 );
	const boxMat = new THREE.MeshBasicMaterial( { color: 0xCCCCCC, wireframe: true } );

	const boxMesh = new THREE.Mesh( boxGeo, boxMat );
    box = boxMesh;
	group.add( boxMesh );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 2;
	controls.maxDistance = 40;

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    requestAnimationFrame( animate );
    render();

}

function render(){

    box.rotation.y += 0.01;


    renderer.render( scene, camera );
}
