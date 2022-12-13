var PosX =[];
var PosZ =[];

var zoom = 1;

    			
svg.attr('width',800)
.attr('height',800)
.attr('style', "background: rgb(0, 0, 0);background-image: url(img/back01.png);background-repeat: no-repeat;background-position: center;background-size: 100% 100%;");
//.attr('style',"outline:solid 3px red; margin-top: 1%");

    			
var Mongraph = svg.append("g")
  .attr('width',800)
  .attr('height',"auto")
  //.attr('style',"outline:solid 3px blue");
  
   /*Mongraph.append("circle")
  .attr("cx",400)
  .attr("cy",400)
  .attr("r",100)
  .attr("fill","brown");*/


 data.forEach(element => {

   if (element.RightControllerPosWorldZ != "NULL"){
      PosZ.push(element.RightControllerPosWorldZ)
      PosX.push(element.RightControllerPosWorldX)
   }
   else {
    PosX.push(0)
    PosZ.push(0)
   }
  });
  
  //console.log(PosX[32])
  
var zScale = d3.scaleLinear()
    			.domain([Math.max(...PosZ), Math.min(...PosZ)]) 
    			.range([0, 800]);
var xScale = d3.scaleLinear()
    			.domain([Math.max(...PosX), Math.min(...PosX)]) 
    			.range([0,800]);
    			
  
 function getCoord(i){
   
   var Coord = [0,0];
   Coord [1] = zScale(PosZ[i]);
   Coord [0] = xScale(PosX[i]);
   
    return([Coord[0],Coord[1]])
  }
  
      
      PosX.forEach(function(e,i){
        
       Mongraph.append("circle")
      .attr("cx", (d) => getCoord(i)[0] )
      .attr("cy", (d) => getCoord(i)[1] )
      .attr("r", 2)
      .style("fill","red");
      
      
      });