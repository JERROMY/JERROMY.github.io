import * as THREE from 'three';

function GrassShaderMaterial( shaders ){

    const grassMaskTex = new THREE.TextureLoader().load( '../textures/grass.jpg' );
    const grassDiffTex = new THREE.TextureLoader().load( '../textures/grass_diffuse.jpg' );

    
    const uniforms = {
    
        time: { value: 0 },
        grassMaskTex: { value: grassMaskTex },
        grassDiffTex: { value: grassDiffTex },
    
    };

    const Grass_VS = shaders.get('Grass_VS');
    const Grass_FS = shaders.get('Grass_FS');


    const basicShaderMaterial = new THREE.RawShaderMaterial( {

        uniforms: uniforms,
        vertexShader: Grass_VS,
        fragmentShader: Grass_FS,
        
        // blending: THREE.AdditiveBlending,
        side:THREE.DoubleSide,
        // depthTest : false,
        // depthWrite : false,
        // transparent: true,
        // vertexColors: true

    } );

    return basicShaderMaterial;
}

export { GrassShaderMaterial };