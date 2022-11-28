var EyesDirX =[];
var EyesDirY =[];
var zoom = 1;
var graphValueMax = 0.5;
var pointsArray = [null]
var pointsOnlyX = []
var pointsOnlyY = []


svg.attr('width',900)
.attr('height',900)
.attr('style', "background: rgb(255, 255, 255);background-image: url(img/back02.png);background-repeat: no-repeat;background-position: 50% 40% ;background-size: 140%;");
//.attr('style',"outline:solid 3px red; margin-top: 1%");

    			
var Mongraph = svg.append("g")
  .attr('width',900)
  .attr('height',"auto")
  //.attr('style',"outline:solid 3px blue");
  


function PointLimit(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
}

  function storeCoords(xVal, yVal) { pointsArray.push([xVal,yVal,0])}
  
 data.hull_list.forEach((element,i) => {                        //The forEach parse a very low amount of data as it search through only hull points
    Xcoord = parseFloat(data.MainData[data.hull_list[i]-1].LocalGazeDirectionX)*1.02      
    Ycoord = parseFloat(data.MainData[data.hull_list[i]-1].LocalGazeDirectionY)*1.02
    storeCoords(Xcoord,Ycoord)
    }); 
  
  
var xScale = d3.scaleLinear()
    			.domain([graphValueMax/zoom, -graphValueMax/zoom]) 
    			.range([0, 900]);
var yScale = d3.scaleLinear()
    			.domain([-graphValueMax/zoom, graphValueMax/zoom]) 
    			.range([0,900]);
    			
svg.append('g')
	.attr('transform', 'translate(450,0)')
	.call(d3.axisLeft(xScale).ticks(10));


svg.append('g')
  .attr('transform', 'translate(0,450)')
.call(d3.axisBottom(yScale).ticks(10)); 
  
  
 function getCoordEyesDir(i){
   
   var Coord = [0,0];
   Coord [0] = xScale(data.MainData[i].LocalGazeDirectionX*zoom);
   Coord [1] = yScale(data.MainData[i].LocalGazeDirectionY*zoom);
   
    return([Coord[0],Coord[1]])
  }
  
   function getCoordlimit(i){
   
   var Coord = [0,0];
   Coord [0] = xScale(pointsOnlyX[i]*zoom);
   Coord [1] = yScale(pointsOnlyY[i]*zoom);
    return([Coord[0],Coord[1]])
  }
  
      
  data.MainData.forEach(function(e,i){
        
  Mongraph.append("circle")
  .attr("cx", (d) => getCoordEyesDir(i)[0] )
  .attr("cy", (d) => getCoordEyesDir(i)[1] )
  .attr("r", 0.6)
  .style("fill","rgb(255, 102, 102)");
  })
  
  var line= d3.line()
      .x((d,i) => getCoordEyesDir(i)[0])
      .y((d,i) => getCoordEyesDir(i)[1])
      //.curve(d3.curveMonotoneX)
  
      
  Mongraph.append("path")
    .datum(data.MainData)
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "rgb(153, 153, 153)")
    .style("stroke-width", "1");


function findCenter(points) {
  var x = 0, y = 0, i, len = points.length;
  for (i = 1; i < len; i++) {
    x += points[i][0];
    y += points[i][1];
  }
  x = x/(len-1)
  y = y/(len-1)
  returnvar = [x,y]
  
  return (returnvar);   // return average position
}

function findAngles(c, points) {
  var i, len = points.length, p, dx, dy;
  for (i = 1; i < len; i++) {
    p = points[i];
    dx = p[0] - c[0];
    dy = p[1] - c[1];
    p[2] = Math.atan2(dy, dx);
  }
}


      // find center
      var cent = findCenter(pointsArray);
      
      
      // find angles
      findAngles(cent, pointsArray);
      
      pointsArray = removeDuplicate(pointsArray)
      
      pointsArray = Sort(pointsArray);

      ToAnotherList(pointsArray);
      
    var line2= d3.line()
      .x((d,i) => getCoordlimit(i)[0])
      .y((d,i) => getCoordlimit(i)[1])
      //.curve(d3.curveMonotoneX)
      
  Mongraph.append("path")
    .datum(data.MainData)
    .attr("d", line2)
    .style("fill", "none")
    .style("stroke", "rgb(0, 89, 179)")
    .style("stroke-width", "3");      
      

      
  function Sort(points){
    var i, j, len = points.length
    for( i=0 ; i<len-1 ; i++){
      for( j=i+1 ; j<len ; j++){
        if ( points[i][2] > points[j][2] ) {
          c = points[i];
          points[i] = points[j];
          points[j] = c;
        }
      }
    }
    /*c = points[0]
    points[0] = points[1]
    points[1] = c*/
    
    return points
  }
  
  function removeDuplicate (points){
    var len = points.length;
    var test = [];
    
    for( var i=2 ; i<len ; i++){
        if ( points[i-1][0] != points[i][0] ) {
            test.push(points[i-1])
        }
      }
      //test.push(points[len-1])
      return test
    }
  
  function ToAnotherList(points) {
    for (i=0; i< points.length; i++){
      pointsOnlyX.push(points[i][0])
      pointsOnlyY.push(points[i][1])
    }
    pointsOnlyX.push(points[0][0])
    pointsOnlyY.push(points[0][1])
  }
  