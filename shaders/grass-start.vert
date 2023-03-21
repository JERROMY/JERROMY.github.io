uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

uniform float time;

attribute vec3 position;
attribute vec3 terrPosi;
attribute vec2 uv;
attribute float angle;

varying vec2 vUv;

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
    
    vec3 finalPosi = position;
    finalPosi.x *= 0.5;
    finalPosi.y += 0.5;

    if( finalPosi.y > 0.5 ){
        finalPosi.x = ( finalPosi.x + sin( time / 800.0 * ( angle * 0.01 )  ) * 0.05 );
        finalPosi.z = ( finalPosi.z + cos( time / 800.0 * ( angle * 0.01 )  ) * 0.05 );
    }

    vec3 axist = vec3(0.0, 1.0, 0.0);
    finalPosi = rotate_vertex_position(finalPosi, axist, angle);



    finalPosi += terrPosi;
    
    //vec3 finalPosi = position + terrPosi;

    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosi, 1.0);

}