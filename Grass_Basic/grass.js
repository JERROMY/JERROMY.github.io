import * as THREE from 'three';
import { GrassShaderMaterial } from '../materials/MaterialsGrassStart.js';
import { shadersMap, loadShader } from '../ShaderGrassStart.js';

// Step 1: Create a Grass Class
class GrassField extends THREE.Group {

    constructor() {
        super();
        console.log("Grass");

        this.axesHelper = new THREE.AxesHelper( 1 );
        this.add( this.axesHelper );
        this.axesHelper.visible = false;

        this.instances = 10000;
        this.w = 10;
        this.d = 10;
        this.h = 0;

        this.positions = [];
        this.indexs = [];
        this.uvs = [];
        this.terrPosis = [];
        this.angles = [];

        this.grassGeo;
        this.grassParticles;
        this.createParticles();

        this.grassPlaneGeo = new THREE.PlaneGeometry( this.w, this.d );
        this.grassPlaneMat = new THREE.MeshBasicMaterial( {color: 0x08731f, side: THREE.DoubleSide} );
        this.grassPlane = new THREE.Mesh( this.grassPlaneGeo, this.grassPlaneMat );
        this.add( this.grassPlane );
        this.grassPlane.rotation.x = Math.PI / 2;



    }

    createParticles() {

        this.positions.push( 0.5, -0.5, 0 );
        this.positions.push( -0.5, -0.5, 0 );
        this.positions.push( -0.5, 0.5, 0 );
        this.positions.push( 0.5, 0.5, 0 );

        this.indexs.push(0);
        this.indexs.push(1);
        this.indexs.push(2);
        this.indexs.push(2);
        this.indexs.push(3);
        this.indexs.push(0);

        this.uvs.push(1.0, 0.0);
        this.uvs.push(0.0, 0.0);
        this.uvs.push(0.0, 1.0);
        this.uvs.push(1.0, 1.0);

        for( let i = 0 ; i < this.instances ; i++ ){

            let posiX = Math.random() * this.w - this.w/2;
            let posiY = this.h;
            let posiZ = Math.random() * this.d - this.d/2;

            //posiX = posiY = posiZ = 0;

            this.terrPosis.push( posiX, posiY, posiZ );

            let angle = Math.random()*360;
            this.angles.push( angle );

        }

        this.grassGeo = new THREE.InstancedBufferGeometry();
        this.grassGeo.instanceCount = this.instances;

        this.grassGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( this.positions, 3 ) );
        this.grassGeo.setAttribute( 'uv', new THREE.Float32BufferAttribute( this.uvs, 2 ) );
        this.grassGeo.setIndex(new THREE.BufferAttribute(new Uint16Array( this.indexs ), 1));

        this.grassGeo.setAttribute( 'terrPosi', new THREE.InstancedBufferAttribute( new Float32Array( this.terrPosis ), 3 ) );
        this.grassGeo.setAttribute( 'angle', new THREE.InstancedBufferAttribute(  new Float32Array( this.angles ), 1 ).setUsage( THREE.DynamicDrawUsage ) );

        const grassMat = GrassShaderMaterial( shadersMap );

        this.grassParticles = new THREE.Mesh( this.grassGeo, grassMat );
        this.grassParticles.frustumCulled = false;
        this.add( this.grassParticles );


    }

    update( dt ){

        let t = dt;
        this.grassParticles.material.uniforms.time.value = t;


    }

}

export { GrassField };