
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

var container, stats, camera, controls, scene, renderer;

Global = {}

Global.init = function() {
    var self = this;
    camera = new THREE.PerspectiveCamera(10, 
					 window.innerWidth / window.innerHeight, 
					 19, 
					 600000);
    // Eye position
    camera.position.set(0, 23000, 30000);
    //camera.rotation.set(Math.PI/4, 0,0);
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
	antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';    
    container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    
    window.addEventListener('resize', self.onWindowResize, false );

    Tools.addCoordinateAxes(scene, 150);
    Tools.trackballControl(scene);
    Tools.initStats(container);
    self.animate();    
    self.generateMap();
}

var solarSystem;

Global.generateMap = function() {
    
    solarSystem = new SolarSystem({
    	name : 'Europa',
    	radius : 13000,
    	scene : scene,
	matrice : true,
    	star : {
    	    radius : 700,
    	    rotation_time : 350,
	    propagation : {
		enabled : true,
		speed : 70,
		max : 14000,
		min : 700
	    },	    
    	    satellites : [{
    		name : 'Earth',
    		radius : 100,
		project : true,
    		coordinates : [1400, 550, 0],
    		type : 'vividEarth',
    		revolution_time : 70,
    		rotation_time : 10,
    		satellites : [{
    		    name : 'Lune',
    		    radius : 10,
    		    coordinates : [140, 0, 0],
    		    type : 'Moon',
    		    revolution_time : 20,
    		    rotation_time : 3
    		}]
    	    }, {
	    	name : 'Orion',
	    	radius : 230,
		project : true,
	    	coordinates : [-1800, -400, -400],
	    	revolution_time : 130,
	    	rotation_time : 30
	    }, {
		name : 'Megathron',
		radius : 530,
		project : true,
		coordinates : [3800, 90, -400],
		revolution_time : 230,
	    	rotation_time : 30,
		satellites : [{
    		    name : 'Lune',
    		    radius : 30,
    		    coordinates : [620, 0, 0],
    		    type : 'Moon',
    		    revolution_time : 45,
    		    rotation_time : 3
    		}]
	    }, {
		name : 'Megathron',
		radius : 300,
		coordinates : [-4800, -1130, 1800],
		revolution_time : 330,
		project : true,
	    	rotation_time : 30,
    		satellites : [{
    		    name : 'Lune',
    		    radius : 30,
    		    coordinates : [360, 0, 0],
    		    type : 'Moon',
    		    revolution_time : 15,
    		    rotation_time : 3
    		}, {
		    name : 'Lune',
    		    radius : 10,
    		    coordinates : [330, 0, 0],
    		    type : 'Moon',
    		    revolution_time : 20,
    		    rotation_time : 3
    		}]
	    }]
	}
    });

}

Global.onWindowResize = function() {    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (controls)
	controls.handleResize();    
}

Global.animate = function() {
    requestAnimationFrame(Global.animate);
    
    if (solarSystem) {
	solarSystem.parent.traverse(function(child) { 
	    if (child.animate)
		child.animate();
	});
    }
    
    if (controls)
	controls.update();
    if (stats)
	stats.update();

    renderer.render(scene, camera);
}

/*
 * Main
 */
Global.init();
