var Global_Variables = {
  zoom : 1,
  graphValueMax : 0.5,
  pointsArray : [null],
  pointsOnlyX : [],
  pointsOnlyY : [],
  xScale : {},
  yScale : {},
  height : 800,
  width : 800
}

function storeCoords(xVal, yVal) { Global_Variables.pointsArray.push([xVal,yVal,0])}

function getCoordEyesDir(i){
   
   var Coord = [0,0];
   Coord [0] = Global_Variables.xScale(data.MainData[i].LocalGazeDirectionX*Global_Variables.zoom);
   Coord [1] = Global_Variables.yScale(data.MainData[i].LocalGazeDirectionY*Global_Variables.zoom);
   
    return([Coord[0],Coord[1]])
}
  
function getCoordlimit(i){
   
   var Coord = [0,0];
   Coord [0] = Global_Variables.xScale(Global_Variables.pointsOnlyX[i]*Global_Variables.zoom);
   Coord [1] = Global_Variables.yScale(Global_Variables.pointsOnlyY[i]*Global_Variables.zoom);
    return([Coord[0],Coord[1]])
}

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
      return test
    }
  
function ToAnotherList(points) {
    for (i=0; i< points.length; i++){
      Global_Variables.pointsOnlyX.push(points[i][0])
      Global_Variables.pointsOnlyY.push(points[i][1])
    }
    Global_Variables.pointsOnlyX.push(points[0][0])
    Global_Variables.pointsOnlyY.push(points[0][1])
  }
  
function PrepareGraph(){
      svg.attr('width',Global_Variables.width)
    .attr('height',Global_Variables.height)
    .attr('style', "background: rgb(255, 255, 255);background-image: url(img/back01.svg);background-repeat: no-repeat;background-position: 50% 40%    ;background-size: "+Global_Variables.zoom*160+"%;");

    			
    var Graph = svg.append("g")
    .attr('width',Global_Variables.width)
    .attr('height',Global_Variables.height)
    
    Global_Variables.xScale = d3.scaleLinear()
    			.domain([Global_Variables.graphValueMax/Global_Variables.zoom, -Global_Variables.graphValueMax/Global_Variables.zoom]) 
    			.range([0, Global_Variables.width]);
    Global_Variables.yScale = d3.scaleLinear()
    			.domain([-Global_Variables.graphValueMax/Global_Variables.zoom, Global_Variables.graphValueMax/Global_Variables.zoom]) 
    			.range([0,Global_Variables.height]);
    			
    svg.append('g')
    	.attr('transform', 'translate('+(Global_Variables.height/2)+',0)')
    	.call(d3.axisLeft(Global_Variables.xScale).ticks(10));
    
    svg.append('g')
      .attr('transform', 'translate(0,'+(Global_Variables.width/2)+')')
      .call(d3.axisBottom(Global_Variables.yScale).ticks(10));   
      
      return Graph;
}  
  
function DrawGraph(){
  
  Graph = PrepareGraph();
  
   data.hull_list.forEach((element,i) => {              //The forEach parse a very low amount of data as it search through only hull points
    Xcoord = parseFloat(data.MainData[data.hull_list[i]-1].LocalGazeDirectionX)*1.02      
    Ycoord = parseFloat(data.MainData[data.hull_list[i]-1].LocalGazeDirectionY)*1.02
    storeCoords(Xcoord,Ycoord)
    }); 
  
      
  data.MainData.forEach(function(e,i){
        
  Graph.append("circle")
  .attr("cx", (d) => getCoordEyesDir(i)[0] )
  .attr("cy", (d) => getCoordEyesDir(i)[1] )
  .attr("r", 0.6)
  .style("fill","rgb(255, 102, 102)");
  })
  
  var EyesPath= d3.line()
      .x((d,i) => getCoordEyesDir(i)[0])
      .y((d,i) => getCoordEyesDir(i)[1])
  
      
  Graph.append("path")
    .datum(data.MainData)
    .attr("d", EyesPath)
    .style("fill", "none")
    .style("stroke", "rgb(153, 153, 153)")
    .style("stroke-width", "1");

      // find center
      var cent = findCenter(Global_Variables.pointsArray);
      
      // find angles
      findAngles(cent, Global_Variables.pointsArray);
      
      Global_Variables.pointsArray = removeDuplicate(Global_Variables.pointsArray)
      
      Global_Variables.pointsArray = Sort(Global_Variables.pointsArray);

      ToAnotherList(Global_Variables.pointsArray);
      
    var boundaryline= d3.line()
      .x((d,i) => getCoordlimit(i)[0])
      .y((d,i) => getCoordlimit(i)[1])
      
      
  Graph.append("path")
    .datum(data.MainData)
    .attr("d", boundaryline)
    .style("fill", "none")
    .style("stroke", "rgb(0, 89, 179)")
    .style("stroke-width", "3");      
   
}
  
DrawGraph()
