precision mediump float;

varying vec2 vUv;

uniform sampler2D grassMaskTex;
uniform sampler2D grassDiffTex;

void main()
{
    vec3 grassMaskColor = texture2D( grassMaskTex, vUv ).rgb;
    vec3 grassColor = texture2D( grassDiffTex, vUv ).rgb;
    gl_FragColor = vec4( grassColor, 1.0 );

    //gl_FragColor = vec4 ( 1.0, 0.0, 0.0, 1.0 );

    if( grassMaskColor.r <= 0.1 ){
        discard;
    }
}