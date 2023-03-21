import * as THREE from 'three';

function BasicShaderMaterial( shaders ){

    const uniforms = {
    };

    const Basic_VS = shaders.get('Basic_VS');
    const Basic_FS = shaders.get('Basic_FS');

    //console.log( Basic_VS )
    //console.log( Basic_FS )

    const basicShaderMaterial = new THREE.RawShaderMaterial( {

        uniforms: uniforms,
        vertexShader: Basic_VS,
        fragmentShader: Basic_FS,
        
        // blending: THREE.AdditiveBlending,
        // side:THREE.DoubleSide,
        // depthTest : false,
        // depthWrite : false,
        // transparent: true,
        // vertexColors: true

    } );

    return basicShaderMaterial;
}

export { BasicShaderMaterial };