uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec3 terrPosi;
attribute vec2 uv;
attribute float angle;

uniform float time;

varying vec2 vUv;
varying vec3 vPosition;
varying float vAngle;

vec4 quat_from_axis_angle(vec3 axis, float angle){ 
    vec4 qr;
    float half_angle = (angle * 0.5) * 3.14159 / 180.0;
    qr.x = axis.x * sin(half_angle);
    qr.y = axis.y * sin(half_angle);
    qr.z = axis.z * sin(half_angle);
    qr.w = cos(half_angle);
    return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle){

    vec4 q = quat_from_axis_angle(axis, angle);
    vec3 v = position.xyz;
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);

}

void main()
{
    
    vUv = uv;
    vAngle = angle;

    vec3 upDir = vec3(0.0, 1.0, 0.0);

    vec3 finalPosi = position;
    finalPosi.x *= 0.1;
    finalPosi.y *= 1.0;
    finalPosi.y += 0.5;

    

    finalPosi = rotate_vertex_position(finalPosi, upDir, vAngle);

    if( finalPosi.y > 0.5 ){
        finalPosi.x = ( finalPosi.x + sin( time / 1000.0 * ( vAngle * 0.01 )  ) * 0.05 );
        finalPosi.z = ( finalPosi.z + cos( time / 1000.0 * ( vAngle * 0.01 )  ) * 0.05 );
    }

    
    
    finalPosi = terrPosi + finalPosi;
    

    

    vec4 posi = vec4( finalPosi, 1.0 );
    vec4 mPosi = modelViewMatrix * posi;
    
    
    gl_Position = projectionMatrix * mPosi;

    

}