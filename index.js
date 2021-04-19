import * as THREE from './three.js-master/build/three.module.js'
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from './three.js-master/examples/jsm/exporters/GLTFExporter.js';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js'
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const loader = new  GLTFLoader();

let clock = new THREE.Clock()
let mixer
loader.load(
	'models/ThreeJsTestAnimation.glb',
	function ( glb ) {
        const model = glb.scene
        model.scale.set(0.5,0.5,0.5)
        model.position.set(-0.7,0,0)

        // Comment/Uncomment this to disable/enable shadows
		model.traverse(c=>{
            c.castShadow = true;
        })

        model.traverse((node)=>{
            // console.log(node.name)
            if(node.name === "Geo" || node.name === "Carpet_Geo" || node.name === "BS_CardGeo"){
                if ( node.isMesh ) { 
                    node.receiveShadow = true;
                }
            }
            // if(node.name === "Sanitizer_dispenzer_stand_Grp"){
            //     if ( node.isMesh ) { 
            //         node.castShadow = true;
            //     }
            // }
            // if(node.name === "Urvi_CH_Grp001"){
            //     node.traverse((element)=>{
            //         if (element.isMesh ) { 
            //             node.castShadow = true;
            //         }
            //     })
            // }
    
        });
    
        scene.add(model);

        mixer = new THREE.AnimationMixer(model)
        const clips = glb.animations
        let walkAnim = mixer.clipAction(clips[0])
	    walkAnim.clampWhenFinished = true
        walkAnim.loop = THREE.LoopOnce
        walkAnim.play()
        // let idleAnim = mixer.clipAction(clips[1])
        // idleAnim.play()

        // Exporting to GLTF and upload it to https://sandbox.babylonjs.com/
        // const exporter = new GLTFExporter();
        // exporter.parse( scene, function ( gltf ) {
        //     // Printing the json so that I can use it to 
        //     // create a gltf file manually
        //     // console.log( JSON.stringify(gltf));
        // }, {
        //     trs:true,
        //     binary:false,
        //     onlyVisible:true,
        //     animations:glb.animations
        // });
       
		glb.animations; // Array<THREE.AnimationClip>
		glb.scene; // THREE.Group
		glb.scenes; // Array<THREE.Group>
		glb.cameras; // Array<THREE.Camera>
		glb.asset; // Object

	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	}
);

// var light = new THREE.PointLight( 0xffffcc, 20, 200 );
// light.position.set( 4, 30, -20 );
// scene.add( light );

let light = new THREE.DirectionalLight(0xffffff,1);
light.position.set( 2,2,5 );
light.castShadow = true
scene.add( light );

// var light2 = new THREE.AmbientLight( 0xffffff,1.5);
// light2.position.set( 30, -10, 30 );
// scene.add( light2 );



/*
--------- Boiler Plate Code--------
*/
const sizes = {
    width:window.innerWidth, 
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height,0.1,100)
camera.position.set(0,1,2)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.gammaOutput = true
const controls = new OrbitControls( camera, renderer.domElement );
controls.update()

function animate() {
	requestAnimationFrame(animate);
	const delta = clock.getDelta();
	if (mixer) 
        mixer.update( delta);

    controls.update()
	renderer.render( scene, camera );

}

animate()
