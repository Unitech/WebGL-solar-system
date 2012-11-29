
Tools = {};

Tools.initStats = function(div) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    div.appendChild(stats.domElement);
}



Tools.addCoordinateAxes = function(objecto, size) {
    size = (typeof size === 'undefined' ? 50 : size);
    
    function v(x,y,z){ 
        return new THREE.Vector3(x,y,z); 
    }
      
    var lineGeo = new THREE.Geometry();
    lineGeo.vertices.push(
        v(-size, 0, 0), v(size, 0, 0),
        v(0, -size, 0), v(0, size, 0),
        v(0, 0, -size), v(0, 0, size)
    );

    var lineMat = new THREE.LineBasicMaterial({
        color: 0x000000, 
	lineWidth: 1
    });
    var line = new THREE.Line(lineGeo, lineMat);
    line.type = THREE.Lines;
    objecto.add(line);
}


Tools.trackballControl = function() {
    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];
}