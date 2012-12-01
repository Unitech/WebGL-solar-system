

function Globe(prm) {
    var self = this;

    this.name = prm.name;
    this.radius = prm.radius || 50;
    this.revolution_time = prm.revolution_time || 0;
    this.rotation_time = prm.rotation_time || 1;
    
    self.animation_functions = [];

    this.satellitesData = prm.satellites || [];
    this.satellites = [];

    
    this.axis_one = new THREE.Object3D();
    this.pivot = new THREE.Object3D();
    this.axis_two = new THREE.Object3D();

    
    this.axis_one.rotation.x = (Math.PI/180) * (prm.rotation || 0);
    if (prm.rotation)
	self.pivot.rotation.y = (Math.PI/180) * -50;
    
    prm.coordinates = (prm.coordinates ? prm.coordinates : [0,0,0]);
    this.x = prm.coordinates[0];
    this.y = prm.coordinates[1];
    this.z = prm.coordinates[2];
    this.axis_two.position.set(this.x, 0, this.z);

    this.matrice_radius = prm.matrice_radius || 1000;



    
    
    this.propagation_struct = {
	current_radius : 0,
	circle : null,
	max : 0,
	min : 0,
	speed : 0
    };
    _.extend(self.propagation_struct, prm.propagation);


    this.scene = prm.scene || null;

    this.is_satellite = prm.is_satellite || false;

    // Is the center of the solar system
    if (prm.parent_el && self.is_satellite == false) {
	prm.parent_el.add(this.axis_two);
    }
    // It's a satellite
    else if (prm.parent_el && self.is_satellite) {
	self.axis_one.add(self.pivot);
	self.pivot.add(self.axis_two);
	prm.parent_el.add(self.axis_one);
    }

	
    
    this.drawGlobe();
    this.buildSatellites();
    this.fuseAnimationWithObject();
    this.drawRevolutionCircle();

    if (this.propagation_struct.enabled == true) {
	self.animation_functions.push(function() {
	    self.propagation();
	});
	this.propagation();
    }
    // if (prm.project) 
    // 	self.projectDraw();
    
    return this;
}

Globe.prototype.buildSatellites = function() {
    var self = this;

    self.satellitesData.forEach(function(dt) {
	dt['is_satellite'] = true;

	dt['scene'] = scene;

	dt.parent_el = self.axis_two;
	var pl = new Globe(dt);	
    });
}

//
// It's an array of function to be executed for animation
//
Globe.prototype.fuseAnimationWithObject = function() {
    var self = this;

    // Self rotation
    self.animation_functions.push(function() {
	self.planet.rotation.y += 1 / self.rotation_time;    	
    });

    // Planet rotation around star
    if (this.pivot) {
	self.animation_functions.push(function() {
	    self.pivot.rotation.y += 1 / self.revolution_time;
	});
    }
    
    // Inject functions array
    self.axis_two.animate = function() {	
	self.animation_functions.forEach(function(dt) {
	    dt();
	});
    };

}

Globe.prototype.drawRevolutionCircle = function() {
    var circle = new THREE.Shape();
    circle.moveTo(this.x, 0);
    circle.absarc(0, 0, this.x, 0, Math.PI*2, false);
    
    var points = circle.createPointsGeometry(100);
    v_circle = new THREE.Line(points, 
			      new THREE.LineBasicMaterial({ 
				  color : 0xeeeeee,
				  opacity : 0.1,
				  linewidth: 2
			      }));
    
    v_circle.rotation.set(Math.PI/2, 0, 0);

    this.axis_one.add(v_circle);
}

Globe.prototype.drawGlobe = function() {
    var self = this;
    var geometry = new THREE.SphereGeometry(self.radius, 16, 16);
    var material = new THREE.MeshBasicMaterial({ 
	color: 0x91FFFE, 
	wireframe: true 
    });
        
    this.planet = new THREE.Mesh(geometry, material);

    this.axis_two.add(this.planet);
}

Globe.prototype.projectDraw = function() {
    var self = this;
    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry2.vertices.push(new THREE.Vector3(0, -self.y, 0));
	
    var line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial({
        color: 0xeeeeee,
	opacity : 0.3
    }));

    var tmp_sphere = new THREE.Shape();
    tmp_sphere.moveTo(200, 0 );
    tmp_sphere.absarc(0, 
		      0, 
		      200, 
		      0, 
		      Math.PI*2, 
		      false);

    var points = tmp_sphere.createPointsGeometry(100);
    var circle = new THREE.Line(points, 
				 new THREE.LineBasicMaterial({ 
				     color : 0xeeeeee,
				     opacity : 0.2,
				     linewidth: 1
				 }));        

    circle.rotation.set(Math.PI/2, 0, 0);
    circle.position.set(0, -self.y, 0);

    self.axis_two.add(circle);
    this.axis_two.add(line2);
}

Globe.prototype.propagation = function() {
    var self = this;
    var prop = self.propagation_struct;


    if (prop.current_radius > prop.max || prop.current_radius == 0)
	prop.current_radius = prop.min;
    else
	prop.current_radius += prop.speed;


    self.axis_two.remove(prop.circle);

    var tmp_sphere = new THREE.Shape();
    tmp_sphere.moveTo(prop.current_radius, 0 );
    tmp_sphere.absarc(0, 
		      0, 
		      prop.current_radius, 
		      0, 
		      Math.PI*2, 
		      false);

    var points = tmp_sphere.createPointsGeometry(100);
    prop.circle = new THREE.Line(points, 
				 new THREE.LineBasicMaterial({ 
				     color : 0xeeeeee,
				     opacity : 0.8 - (prop.current_radius / (prop.max - prop.min)),
				     linewidth: 1
				 }));
    
    
    prop.circle.rotation.set(Math.PI/2, 0, 0);
    self.axis_two.add(prop.circle);
}
