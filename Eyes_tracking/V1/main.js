var EyesDirX =[];
var EyesDirY =[];
var zoom = 1.5;
var graphValueMax = 1;

    			
svg.attr('width',800)
.attr('height',800)
//.attr('style', "background: rgb(0, 0, 0);background-image: url(img/back01.png);background-repeat: no-repeat;background-position: center;background-size: //100% 100%;");
//.attr('style',"outline:solid 3px red; margin-top: 1%");



    			
var Mongraph = svg.append("g")
  .attr('width',800)
  .attr('height',"auto")
  //.attr('style',"outline:solid 3px blue");
  


 data.forEach((element,i) => {

   if (element.LocalGazeDirectionX != "NULL"){
      EyesDirX.push(element.LocalGazeDirectionX)
      EyesDirY.push(element.LocalGazeDirectionY)
   }
   else {
    EyesDirX.push(EyesDirX[i-1])
    EyesDirY.push(EyesDirY[i-1])
   }
  });
  
  
var xScale = d3.scaleLinear()
    			.domain([graphValueMax/zoom, -graphValueMax/zoom]) 
    			.range([0, 800]);
var yScale = d3.scaleLinear()
    			.domain([-graphValueMax/zoom, graphValueMax/zoom]) 
    			.range([0,800]);
    			
svg.append('g')
	.attr('transform', 'translate(400,0)')
	.call(d3.axisLeft(xScale).ticks(10));


svg.append('g')
  .attr('transform', 'translate(0,400)')
.call(d3.axisBottom(yScale).ticks(10)); 
  
  
 function getCoord(i){
   
   var Coord = [0,0];
   Coord [0] = xScale(EyesDirX[i]*zoom);
   Coord [1] = yScale(EyesDirY[i]*zoom);
   
    return([Coord[0],Coord[1]])
  }
  
      
  EyesDirX.forEach(function(e,i){
        
  Mongraph.append("circle")
  .attr("cx", (d) => getCoord(i)[0] )
  .attr("cy", (d) => getCoord(i)[1] )
  .attr("r", 1)
  .style("fill","red");
  })
  
  var line= d3.line()
      .x((d,i) => getCoord(i)[0])
      .y((d,i) => getCoord(i)[1])
      .curve(d3.curveMonotoneX)
      
      
  Mongraph.append("path")
    .datum(data)
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", "1");
    
