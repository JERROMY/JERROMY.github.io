uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

}