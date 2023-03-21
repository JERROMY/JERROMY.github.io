const basic_shader_url = '../shaders/'
const shaderURLs = [
    basic_shader_url + 'grass.vert',
    basic_shader_url + 'grass.frag',
];

const shadersName = [
    'Grass',

];

const shadersMap = new Map();

async function loadShader( startScene ) {
    const files = await Promise.all(shaderURLs.map( loadTextFile ));

    let shaderCount = files.length;
    //console.log( shaderCount );
    let tempID = -1;

    for(let i = 0 ; i < shaderCount ; i++){
        //const file = files[i];
        const shaderID = Math.floor( i/2 );
        if( shaderID != tempID ){
            const shaderName = shadersName[ shaderID ];
            
            shadersMap.set(shaderName + "_VS", files[i]);
            shadersMap.set(shaderName + "_FS", files[i + 1]);
            
        }

        tempID = shaderID;
        
    }

    //console.log( shadersMap );
    startScene()
    

}

function loadTextFile( url ) {
    return fetch( url ).then( response => response.text() );
}

export { shaderURLs, shadersName, shadersMap, loadShader, loadTextFile };