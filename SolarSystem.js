


function SolarSystem(o) {
    var ss = this;

    ss.name = o.name;
    ss.radius = o.radius;    
    //ss.planets = [];
    ss.star = o.star;
    ss.parent = new THREE.Object3D();
    
    o.scene.add(ss.parent);
 
    ss.addPlanets();
    if (o.matrice) ss.systemMatrice();

    return this;
}


SolarSystem.prototype.addPlanets = function() {
    var ss = this;

    sun = new Globe({
    	radius : ss.star.radius, 
    	matrice : true,
	rotation_time : ss.star.rotation_time,
    	matrice_radius : ss.radius,
    	parent_el : ss.parent,
	satellites : ss.star.satellites,
	propagation : ss.star.propagation
    });

}

SolarSystem.prototype.systemMatrice = function() {
    var self = this;

    var material = new THREE.LineBasicMaterial({
        color: 0xeeeeee,
	opacity : 0.1
    });

    var geometry = new THREE.Geometry();
    
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(self.radius, 
    					     0,
    					     0));
    var AXIS = 36;

    for (var i = 0; i < AXIS; i++) {
    	var line = new THREE.Line(geometry, material);
    	line.rotation.set(0, (i * Math.PI) / (AXIS / 2), 0);
    	self.parent.add(line);
    }

    var ROUND = 19;
    var circle_distance = self.radius / ROUND;
    
    for (var i = 0; i < ROUND + 1; i++) {
	//circles
	var circle = new THREE.Shape();
	circle.moveTo(circle_distance * i, 0 );
	circle.absarc( 0, 0, i * circle_distance, 0, Math.PI*2, false );
	
	var points = circle.createPointsGeometry(100);
	v_circle = new THREE.Line(points, 
				  new THREE.LineBasicMaterial({ 
				      color : 0xeeeeee,
				      opacity : 0.05,
				      linewidth: 1
				  }));
		
	v_circle.rotation.set(Math.PI/2, 0, 0);
	
	
	self.parent.add(v_circle);	
    }

}

