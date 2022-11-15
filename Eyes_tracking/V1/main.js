var EyesDirX =[];
var EyesDirY =[];
var zoom = 1;
var graphValueMax = 0.5;
var Xlimit = []
var Ylimit = []



    			
svg.attr('width',900)
.attr('height',900)
.attr('style', "background: rgb(255, 255, 255);background-image: url(img/back02.png);background-repeat: no-repeat;background-position: 50% 40% ;background-size: 140%;");
//.attr('style',"outline:solid 3px red; margin-top: 1%");



    			
var Mongraph = svg.append("g")
  .attr('width',900)
  .attr('height',"auto")
  //.attr('style',"outline:solid 3px blue");
  


 data.forEach((element,i) => {
    EyesDirX.push(element.LocalGazeDirectionX)
    EyesDirY.push(element.LocalGazeDirectionY)
    if (element.is_hull == true) {
    Xlimit.push(element.LocalGazeDirectionX)
    Ylimit.push(element.LocalGazeDirectionY)
    console.log(Xlimit[i])
    }
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
   Coord [0] = xScale(EyesDirX[i]*zoom);
   Coord [1] = yScale(EyesDirY[i]*zoom);
   
    return([Coord[0],Coord[1]])
  }
  
   function getCoordlimit(i){
   
   var Coord = [0,0];
   Coord [0] = xScale(Xlimit[i]*zoom);
   Coord [1] = yScale(Ylimit[i]*zoom);
   
    return([Coord[0],Coord[1]])
  }


      
  EyesDirX.forEach(function(e,i){
        
  Mongraph.append("circle")
  .attr("cx", (d) => getCoordEyesDir(i)[0] )
  .attr("cy", (d) => getCoordEyesDir(i)[1] )
  .attr("r", 1)
  .style("fill","red");
  })
  
  var line= d3.line()
      .x((d,i) => getCoordEyesDir(i)[0])
      .y((d,i) => getCoordEyesDir(i)[1])
      .curve(d3.curveMonotoneX)
      
      
 var line2= d3.line()
      .x((d,i) => getCoordlimit(i)[0])
      .y((d,i) => getCoordlimit(i)[1])
      .curve(d3.curveMonotoneX)
      
      
  Mongraph.append("path")
    .datum(data)
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", "1");
    
  Mongraph.append("path")
    .datum(data)
    .attr("d", line2)
    .style("fill", "green")
    .style("stroke", "red")
    .style("stroke-width", "2");
    
