

var windowSize={
  height : window.innerHeight*0.9,
  width : window.innerWidth*0.9
};

var pointSize = 2;

var backgroundPicURL = "img/back01.png";



svg.attr('width', windowSize.width)
  .attr('height', windowSize.height);

svg.selectAll('rect')
  .data(data)
  .enter().append('rect')
    .attr('width', pointSize)
    .attr('height', pointSize)
    .attr('rx', 100)
    .attr('y', function(d) {return getPointLocation(d).y})
    .attr('x', function(d) {return getPointLocation(d).x})
    .attr('fill', "blue")
    
    .on("mouseover", function(d,i){ return overFunction(d3.select(this))})
    .on("mouseout",function(d,i){ return outFunction(d3.select(this))})
    
    


svg.attr('style', "background: rgb(255, 255, 255);background-image: url("+backgroundPicURL+");background-repeat: no-repeat;background-position: center;background-size: 100% 100%;");







function getPointLocation(point){
  var location = {
    x: (windowSize.width/2) + (point.RightControllerPosWorldX*(windowSize.width/2))/2,
    y: (windowSize.height/2) + (point.RightControllerPosWorldZ*(windowSize.height/2))/2
  };
  
  return (location);
}

function overFunction(point){
  point.attr('fill', "red")
        .attr('width', pointSize*10)
        .attr('height', pointSize*10)
        .attr('y', function(d) {return getPointLocation(d).y-(pointSize/2)*10})
        .attr('x', function(d) {return getPointLocation(d).x-(pointSize/2)*10});
}

function outFunction(point){
  point.attr('fill', "blue")
        .attr('width', pointSize)
        .attr('height', pointSize)
        .attr('y', function(d) {return getPointLocation(d).y-(pointSize/2)})
        .attr('x', function(d) {return getPointLocation(d).x(pointSize/2)});
}






