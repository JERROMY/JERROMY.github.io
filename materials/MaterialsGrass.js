import * as THREE from 'three';

function GrassShaderMaterial( shaders ){

    
    const grassMaskTex = new THREE.TextureLoader().load( '../textures/grass.jpg' );
    const grassDiffTex = new THREE.TextureLoader().load( '../textures/grass_diffuse.jpg' );
    //console.log( grassTex );
    
    
    const uniforms = {
        grassMaskTex: { value: grassMaskTex },
        grassDiffTex: { value: grassDiffTex },
        time: { type: 'float', value: 0 },
    };

    const Grass_VS = shaders.get('Grass_VS');
    const Grass_FS = shaders.get('Grass_FS');

    

    //console.log( Basic_VS )
    //console.log( Basic_FS )

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