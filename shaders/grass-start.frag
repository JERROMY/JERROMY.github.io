precision mediump float;


uniform sampler2D grassDiffTex;
uniform sampler2D grassMaskTex;

varying vec2 vUv;

void main()
{
    vec3 maskColor = texture2D( grassMaskTex, vUv ).rgb;
    vec3 finalColor = texture2D( grassDiffTex, vUv ).rgb;
    
    gl_FragColor = vec4 ( finalColor, 1.0 );

    if( maskColor.r <= 0.1 ){
        discard;
    }


}