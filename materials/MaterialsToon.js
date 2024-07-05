import * as THREE from 'three';

function ToonShaderMaterial( shaders ){

    const uniforms = {
    };

    const Toon_VS = shaders.get('Toon_VS');
    const Toon_FS = shaders.get('Toon_FS');

    //console.log( Basic_VS )
    //console.log( Basic_FS )

    const toonShaderMaterial = new THREE.RawShaderMaterial( {

        uniforms: uniforms,
        vertexShader: Toon_VS,
        fragmentShader: Toon_FS,
        
        // blending: THREE.AdditiveBlending,
        // side:THREE.DoubleSide,
        // depthTest : false,
        // depthWrite : false,
        // transparent: true,
        // vertexColors: true

    } );

    return toonShaderMaterial;
}

export { ToonShaderMaterial };