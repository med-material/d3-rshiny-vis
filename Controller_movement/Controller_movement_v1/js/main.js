//////////////////////////////////////////////////
/*      Graph D3.js ControllerMovementV01       */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-15-2022                             */
/*      main.js                                 */
//////////////////////////////////////////////////

//Allows visualization of controller movement and mole states.





//******************************************************************************
// Variables *******************************************************************

var windowSettings= {
  height : 800,//px // height of the window
  width : 800,//px // width of the window
  
  backgroundPicURL : "img/fond06.png", // background img of the window
};

var wallSettings = {
  height : 250,//px // height of the graph
  width : 750,//px // width of the graph
  
  marginTop : 10,//px // margin of the graph compared to the top of the window
  marginLeft : 25,//px // margin of the graph compared to the left of the window
  
  
  yScale : {}, // value to pixel for the y conversion obj
  xScale : {}, // value to pixel for the x conversion obj
  
  
  xMin : -4,//minimum x value for the graph
  xMax : 4,//maximum x value for the graph
  
  yMin : -1,//minimum y value for the graph
  yMax : 5,//maximum y value for the graph
  

  pointSize : 20,//px
  pointColor : "#D6D6D6", // default color of the moles
  
  laserSize : 10,//px
  laserColor : "red", // default color of the laser
  
}

var graphSettings={
  height : 446,//px
  width : 446,//px
  
  marginTop : 273,//px
  marginLeft : 175,//px
  
  yScale : {}, // value to pixel for the y conversion obj
  xScale : {}, // value to pixel for the x conversion obj

  
  valueMax : 2,
  zoom : 1.6,
  
  pointSize : 2,//px
  pointColor : "#0055FF11", 

  
  ControllerPicURL : "img/controller.png",
  controllerHeight : 40,//px
  controllerWidth : 40,//px

}



var DataArrays = {
  
  idMoles : [], // list of all moles ID
  xMoles : [], // list of all moles position X 
  yMoles : [], // list of all moles position y
  
  changeIdMoles : [], // list of all moles ID that change state
  changeEventMoles : [], // list of all moles event on change state
  moleDate : [], // list of all the dates that corespond to the moles sates change
  objMoles : [], // list of all moles obj (points into SVG) 

  
  xLaser : [], // list of all laser position X 
  yLaser : [], // list of all laser position Y
  laserDate : [], // list of all the dates that corespond to the laser position change
  objLaser : {}, // obj of laser

  xController : [], // list of all controller position X 
  zController : [], // list of all controller position Y
  yControllerRot : [],
  controllerDate : [], // list of all the dates that corespond to the controller position change
  objController : {}, // obj of controller 
  
 
  
  dateMin : {}, // first date into CSV files
  dateMax : {}, // last date into CSV files
  
  indexDate : {}, //curent date
  indexMole : 0, // curent lines into moles CSV file
  indexLaser : 0, // curent lines into laser CSV file
  indexController : 0,
  
  
}


var sliderSettings = {
  
  height : 60,//px
  width : 450,//px
  
  marginTop : 720,//px
  marginLeft : 175,//px
  
  
  sliderValue : 0,
  
  dateScale : {},
  
  objStartButton : {},
  sBtnHeight : 50,//px
  sBtnWidth : 100,//px
  sBtnMargingTop : 5,//px
  sBtnMargingLeft : 0,
  
  objSlider : {},
  sliderHeight : 50,//px
  sliderWidth : 330,
  sliderMargingTop : 5,//px
  sliderMargingLeft : 10,//px
  
  n : 0,

}



var mouvementSettings = {
  isStart : false,
  index : 0,
}


var centerGraph = {
  x : graphSettings.marginLeft + graphSettings.width/2,
  y : graphSettings.marginTop + graphSettings.height/2
}  



//******************************************************************************
// Initialization **************************************************************




document.body.innerHTML = "";


var back = addElement("div",d3.select("body"),
              [
                "width:"+windowSettings.width+"px;"+
                "height:"+windowSettings.height+"px;"+
                "background-image: url("+windowSettings.backgroundPicURL+");"+
                "background-repeat: no-repeat;"+
                "background-position: center;"+
                "background-size: 100% 100%;"+
                "position: relative"
              ]
            );

  
svg = addElement("svg",back,
          [
            "width:"+wallSettings.width+"px;"+
            "height:"+wallSettings.height+"px;"+
            "position:absolute;"+
            "margin-left:"+(wallSettings.marginLeft)+"px;"+
            "margin-top:"+wallSettings.marginTop+"px"
          ]
      );


var graphWall = addElement("g",svg);

 
var graphController = addElement("div",back,
        [
          "width:" +graphSettings.width+"px;"+
          "height:" +graphSettings.height+"px;"+
          "position:absolute;"+
          "margin-left:"+(graphSettings.marginLeft)+"px;"+
          "margin-top:"+graphSettings.marginTop+"px;"
          // "background: rgb(50, 50, 50, 1)"
        ]
      );

 var graphControllerSvg = addElement("svg",graphController,
        [
          "width:"+graphSettings.width+"px;"+
          "height:"+graphSettings.height+"px;"+
          "position:absolute;"
        ]
      );   
 
 
    
    

  
  
    
//******************************************************************************    
// Prog ************************************************************************    
    
    
    


start();





//******************************************************************************
// Functions *******************************************************************






function addGraphMoles() {
	DataArrays.idMoles.forEach(function(e,i){
		 DataArrays.objMoles.push(
		    addPointOnSvg(graphWall,wallSettings.pointSize,getMolesCoordPx(i)[0],getMolesCoordPx(i)[1],wallSettings.pointColor)
		 );
  });
}





function addLaser(){
	DataArrays.objLaser = addPointOnSvg(graphWall,wallSettings.laserSize,-100,-100,"red");
}



function addController(){
      
  DataArrays.objController = addElement("div",graphController,
                                [
                                  "left:"+200+"px;"+
                                  "top:"+200+"px;"+
                                  "display: flex;"+
                                  "position:absolute;"+
                                  "background: rgb(50, 50, 50, 00);"+
                                  "width:"+(graphSettings.controllerWidth)+"px;"+
                                  "height:"+(graphSettings.controllerHeight)+"px;"+
                                  "justify-content: center;"+
                                  "align-items: flex-top;"+
                                  "background-image: url("+graphSettings.ControllerPicURL+");"+
                                  "background-repeat: no-repeat;"+
                                  "background-position: center;"+
                                  "background-size: 100% 100%;"
                                ]
                              );

}


function addControllerPath(){

   graphControllerSvg
    .selectAll("dot")
      .data(DataArrays.xController)
      .enter()
      .append("circle")
      .attr("cx", (d,i) => getControllerCoordPx(i)[0] )
      .attr("cy", (d,i) => getControllerCoordPx(i)[1] )
      .attr("r", graphSettings.pointSize)
      .style("fill", graphSettings.pointColor);
      
}




function addHeadPoint(){
      
      addElement("div",graphController,
        [
          "left:"+((graphSettings.width/2)-((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))/2)+"px;"+
          "top:"+((graphSettings.height/2)-((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))/2)+"px;"+
          "display: flex;"+
          "position:absolute;"+
          "background: rgb(50, 50, 50, 1);"+
          "width:"+((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))+"px;"+
          "height:"+((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))+"px;"+
          "border-radius:"+(((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))/2)+"px"
        ]
      );
}




function addSlider(){
  
  var divSlider = addElement("div",back,
                    [
                      "display: flex;"+
                      "position:absolute;"+
                      "background: rgb(50, 50, 50, 0);"+
                      "width:"+sliderSettings.width+"px;"+
                      "height:"+(sliderSettings.height)+"px;"+
                      "margin-top:"+sliderSettings.marginTop+"px;"+
                      "margin-left:"+(sliderSettings.marginLeft)+"px;"+
                      "justify-content: center;"+
                      "align-items: flex-top"
                    ]
                  ).attr('id', "divSlider");
  
  
  
  var sliderAxis = addElement("svg",divSlider,
                      [
                        "display: flex;"+
                        "position:absolute;"+
                        "background: rgb(50, 50, 50, 0);"+
                        "width:"+500+"px;"+
                        "height:"+(50)+"px;"+
                        "margin-top:"+40+"px;"+
                        "margin-left:"+(sliderSettings.sBtnWidth+40)+"px;"+
                        "justify-content: center;"+
                        "align-items: flex-top"
                      ]
                    )
  
  
  var startButton = d3.select("#divSlider")
    .append('button')
    .attr('id', "startButton")
    .attr('name', "startButton")
    .attr('text', "startButton")
    .attr('onclick', "startButtonOnclick()")
    .attr('style', "position:absolute")
    .attr('style', "width:"+sliderSettings.sBtnWidth+"px;height:"+sliderSettings.sBtnHeight+"px;margin-top:"+sliderSettings.sBtnMargingTop+"px;margin-left:"+sliderSettings.sBtnMargingLeft+"px");
  
  var Slider = d3.select("#divSlider")
    .append('input')
    .attr('type', "range")
    .attr('min', "0")
    .attr('max', sliderSettings.n)
    .attr('id', "slider")
    .attr('name', "slider")
    .attr('onmousemove', "sliderChange()")
    .attr('style', 
      "width:"+sliderSettings.sliderWidth+"px;"+
      "height:"+sliderSettings.sliderHeight+"px;"+
      "margin-top:"+sliderSettings.sliderMargingTop+"px;"+
      "margin-left:"+sliderSettings.sliderMargingLeft+"px"
      );
  
  
  sliderSettings.objStartButton = document.getElementById('startButton');
  changeStartButtonValues();
  
  sliderSettings.objSlider = document.getElementById('slider');
  
  
  /*sliderAxis.append('g')
	.call(d3.axisBottom(sliderSettings.dateScale).tickFormat(d3.timeFormat("%M")).ticks(d3.timeMinute.every(1)));*/
	
	sliderAxis.append('g')
	.call(d3.axisBottom(sliderSettings.dateScale).tickFormat(d3.timeFormat("%s")).ticks(d3.timeSecond .every(15)));
	

}


function addAxis(){

   graphControllerSvg.append("line")
    .attr("id", "abscisseAxis")
    .attr("class", "axis")
    .attr("x1", 0)   
    .attr("y1", graphSettings.height/2 )     
    .attr("x2", graphSettings.width)    
    .attr("y2", graphSettings.height/2 )
    .style("stroke", "#b3b3b3")
    .style('stroke-width', '2px')
    .style("stroke-dasharray", ("8,8"))
    .style("fill", "none");
    


  
  graphControllerSvg.append("line") 
      .attr("id", "ordinateAxis")
      .attr("class", "axis")
      .attr("x1", graphSettings.width/2 )   
      .attr("y1", 0)     
      .attr("x2", graphSettings.width/2 )    
      .attr("y2", graphSettings.height)
      .style("stroke", "#b3b3b3")
      .style('stroke-width', '2px')
      .style("stroke-dasharray", ("8,8"))
      .style("fill", "none");
      
      
 
 
 graphControllerSvg.append("line") 
      .attr("id", "RightAxis")
      .attr("class", "axis")
      .attr("x1", graphSettings.xScale(1) )   
      .attr("y1", 0)     
      .attr("x2", graphSettings.xScale(1) )    
      .attr("y2", graphSettings.height)
      .style("stroke", "#b3b3b3")
      .style('stroke-width', '2px')
      .style("stroke-dasharray", ("8,8"))
      .style("fill", "none");
      
   graphControllerSvg.append("line") 
      .attr("id", "LeftAxis")
      .attr("class", "axis")
      .attr("x1", graphSettings.xScale(-1) )   
      .attr("y1", 0)     
      .attr("x2", graphSettings.xScale(-1) )    
      .attr("y2", graphSettings.height)
      .style("stroke", "#b3b3b3")
      .style('stroke-width', '2px')
      .style("stroke-dasharray", ("8,8"))
      .style("fill", "none");
      
      
      
      
      
     graphControllerSvg.append("line")
        .attr("id", "topAxis")
        .attr("class", "axis")
        .attr("x1", 0)   
        .attr("y1", graphSettings.yScale(1) )     
        .attr("x2", graphSettings.width)    
        .attr("y2", graphSettings.yScale(1) )
        .style("stroke", "#b3b3b3")
        .style('stroke-width', '2px')
        .style("stroke-dasharray", ("8,8"))
        .style("fill", "none");
        
        
     graphControllerSvg.append("line")
        .attr("id", "bottomAxis")
        .attr("class", "axis")
        .attr("x1", 0)   
        .attr("y1", graphSettings.yScale(-1) )     
        .attr("x2", graphSettings.width)    
        .attr("y2", graphSettings.yScale(-1) )
        .style("stroke", "#b3b3b3")
        .style('stroke-width', '2px')
        .style("stroke-dasharray", ("8,8"))
        .style("fill", "none");
  
}




function getMolesCoordPx(i){
  var coord = [0,0];
  
  coord[0] = wallSettings.xScale(DataArrays.xMoles[i]);
  coord[1] = wallSettings.yScale(DataArrays.yMoles[i]);

  return coord;
}





function getLaserCoordPx(i){
  var coord = [0,0];
  
  coord[0] = wallSettings.xScale(DataArrays.xLaser[i]);
  coord[1] = wallSettings.yScale(DataArrays.yLaser[i]);

  return coord;
}



function getControllerCoordPx(i){
  coord = [0,0,0];
  
  coord[0] = graphSettings.xScale(DataArrays.xController[i]*graphSettings.zoom);
  coord[1] = graphSettings.yScale((DataArrays.zController[i])*graphSettings.zoom);
  coord[2] = DataArrays.yControllerRot[i];

  return coord;
}














function dataLoading(data01){
  
  data.am.forEach(element => { 
    DataArrays.idMoles.push(element.id);
    DataArrays.xMoles.push(element.x);
    DataArrays.yMoles.push(element.y);
  });
  

  data.aed.forEach((element,index) => { 

    DataArrays.changeIdMoles.push(parseInt(element.MoleId));
    DataArrays.changeEventMoles.push(element.Event);
    
    DataArrays.moleDate.push(new Date(element.Timestamp));

  });
  
  data.ad.forEach((element,index) => { 
      if(element.RightControllerLaserPosWorldX != "NULL"){
         DataArrays.xLaser.push(element.RightControllerLaserPosWorldX);
      }else{
         DataArrays.xLaser.push(DataArrays.xLaser[index-1]);
      }
      
      if(element.RightControllerLaserPosWorldY != "NULL"){
         DataArrays.yLaser.push(element.RightControllerLaserPosWorldY);
      }else{
         DataArrays.yLaser.push(DataArrays.yLaser[index-1]);
      }
      
      
     
      DataArrays.laserDate.push(new Date(element.Timestamp));
      
      
      
      
      if(element.RightControllerPosWorldX != "NULL"){
         DataArrays.xController.push(element.RightControllerPosWorldX - element.HeadCameraPosWorldX);
      }else{
         DataArrays.xController.push(DataArrays.xController[index-1]);
      }
      
      if(element.RightControllerPosWorldZ != "NULL"){
         DataArrays.zController.push(( element.RightControllerPosWorldZ - element.HeadCameraPosWorldZ));
      }else{
         DataArrays.zController.push(DataArrays.zController[index-1]);
      }
      
      if(element.RightControllerRotEulerY != "NULL"){
         DataArrays.yControllerRot.push(element.RightControllerRotEulerY);
      }else{
         DataArrays.yControllerRot.push(DataArrays.controllerRot[index-1]);
      }
      
      DataArrays.controllerDate.push(new Date(element.Timestamp));

  });
  
  
  DataArrays.dateMin = new Date(Math.min(...DataArrays.laserDate));
  DataArrays.dateMax = new Date(Math.max(...DataArrays.laserDate));
  
  sliderSettings.n = (DataArrays.dateMax-DataArrays.dateMin)/14;
  

  DataArrays.indexDate = DataArrays.dateMin;
  
  
  wallSettings.yScale = d3.scaleLinear()
		.domain([(wallSettings.yMax), (wallSettings.yMin)]) 
		.range([(0), (wallSettings.height)]);
    			
  wallSettings.xScale = d3.scaleLinear()
  	.domain([(wallSettings.xMin), (wallSettings.xMax)]) 
  	.range([(0), (wallSettings.width)]);
  	
  
  	
  graphSettings.yScale = d3.scaleLinear()
		.domain([(graphSettings.valueMax/graphSettings.zoom), (-graphSettings.valueMax/graphSettings.zoom)]) 
		.range([(0), (graphSettings.height)]);
    			
  graphSettings.xScale = d3.scaleLinear()
  	.domain([(-graphSettings.valueMax/graphSettings.zoom), (graphSettings.valueMax/graphSettings.zoom)]) 
  	.range([(0), (graphSettings.width)]);
  	
  	
  sliderSettings.dateScale = d3.scaleTime()
  .domain([new Date(0),new Date(DataArrays.dateMax.getTime() - DataArrays.dateMin.getTime())])
  .range([0, sliderSettings.sliderWidth]);
  
}






function changeMolesState(){
  
  if(new Date(DataArrays.indexDate) >= new Date(DataArrays.moleDate[DataArrays.indexMole])){
    while(new Date(DataArrays.indexDate) >= new Date(DataArrays.moleDate[DataArrays.indexMole])){
      
      var thisMole = DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])];
      
      switch(DataArrays.changeEventMoles[DataArrays.indexMole]){
        
        case "Mole Spawned":
          changeFillElement(thisMole,"green",1000);
          DataArrays.indexMole++;
          
          break;
          
        case "Fake Mole Spawned":
          changeFillElement(thisMole,"#FFFB00",1000);
          DataArrays.indexMole++;
          
          break;
        
        case "Mole Expired":
          changeFillElement(thisMole,wallSettings.pointColor,1000);
          DataArrays.indexMole++
          break;
          
        case "Fake Mole Expired":
          changeFillElement(thisMole,wallSettings.pointColor,1000);
          DataArrays.indexMole++
          break;
        
        case "Mole Hit":
          changeFillElement(thisMole,"orange",0);
          changeFillElement(thisMole,wallSettings.pointColor,1000);
          DataArrays.indexMole++
          break;
          
        case "Fake Mole Hit":
          changeFillElement(thisMole,"red",0);
          changeFillElement(thisMole,wallSettings.pointColor,1000);
          DataArrays.indexMole++
          break;
        
        default:
          DataArrays.indexMole++
          break;
          
      }
    }
  }
}







function changeLaserLocation(){
  
  if(new Date(DataArrays.indexDate) >= new Date(DataArrays.laserDate[DataArrays.indexLaser])){
    while(new Date(DataArrays.indexDate) >= new Date(DataArrays.laserDate[DataArrays.indexLaser])){

      DataArrays.objLaser.transition()
      .duration(14)
      .attr('cx', function(d) { return getLaserCoordPx(DataArrays.indexLaser )[0]; })
      .attr('cy', function(d) { return getLaserCoordPx(DataArrays.indexLaser )[1]; });
      
      DataArrays.indexLaser++
      
    }
  }
}



function changeControllerLocation(){
  if(new Date(DataArrays.indexDate) >= new Date(DataArrays.controllerDate[DataArrays.indexController])){
    while(new Date(DataArrays.indexDate) >= new Date(DataArrays.controllerDate[DataArrays.indexController])){
      
      DataArrays.objController.transition()
        .duration(14).attr('style', "left:"+(getControllerCoordPx(DataArrays.indexController)[0])+"px;top:"+(getControllerCoordPx(DataArrays.indexController)[1])+"px;display: flex;position:absolute;background: rgb(50, 50, 50, 00);width:"+(graphSettings.controllerWidth)+"px;height:"+(graphSettings.controllerHeight)+"px;justify-content: center;align-items: flex-top;background-image: url("+graphSettings.ControllerPicURL+");background-repeat: no-repeat;background-position: center;background-size: 100% 100%;transform: rotate("+(getControllerCoordPx(DataArrays.indexController)[2])+"deg)");
      
      DataArrays.indexController++
      
    }
  }
}




function changeStartButtonValues(){
  if(mouvementSettings.isStart){
      sliderSettings.objStartButton.textContent = 'Stop';
  }else{
      sliderSettings.objStartButton.textContent = 'Start';
  }
}








function resetMoles(){
  DataArrays.objMoles.forEach((element,index) => { 
   DataArrays.objMoles[index]
   .attr('fill', wallSettings.pointColor);
  });
}



function clock(){
  
  if(mouvementSettings.isStart){
  
      changeLaserLocation();
      changeMolesState();
      changeControllerLocation();
      
      mouvementSettings.index ++;
      DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index); // add 100  Msecond to the curent index date 
    
      sliderSettings.objSlider.value = mouvementSettings.index;
  }
  
  setTimeout(clock, 14);// call clock function in 1000 ms
  
}









function start(){
  
  dataLoading(data);
 
  addControllerPath();
  addGraphMoles();
  addLaser();
  
  addAxis();
  
  addHeadPoint();
  addController();
  
  addSlider();
  
  clock();
  
}





window.startButtonOnclick = function(){
  mouvementSettings.isStart = !mouvementSettings.isStart;
  changeStartButtonValues();
}



window.sliderChange = function(){
  
  if(mouvementSettings.isStart){
  
  }else{

    if(sliderSettings.objSlider.value != mouvementSettings.index){
      
      resetMoles();

      mouvementSettings.index = sliderSettings.objSlider.value;
      
      DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index);
      
      DataArrays.indexMole = 0;
      DataArrays.indexLaser = 0;
      DataArrays.indexController = 0;

      
      if(new Date(DataArrays.indexDate) >= new Date(DataArrays.laserDate[DataArrays.indexLaser])){
        while(new Date(DataArrays.indexDate) >= new Date(DataArrays.laserDate[DataArrays.indexLaser])){
          DataArrays.indexLaser++
        }
      }
  
  
      if(new Date(DataArrays.indexDate) >= new Date(DataArrays.controllerDate[DataArrays.indexController])){
        while(new Date(DataArrays.indexDate) >= new Date(DataArrays.controllerDate[DataArrays.indexController])){
          DataArrays.indexController++
        }
      }
  
      changeLaserLocation();
      changeControllerLocation();
      
      mouvementSettings.isStart = true;
      
      setTimeout(function(){mouvementSettings.isStart = false;},100);
  
    }
  }
}





//******************************************************************************
//******************************************************************************


//general Functions

function changeFillElement(element = {}, color="#00000000",duration = 0){
  element.transition()
      .duration(duration)
      .attr('fill', color);
}


function addPointOnSvg(svg01={},r=2,x=0,y=0,color="blue"){
  return (
    svg01.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r)
      .attr('fill', color)
    );
}




function addElement(element = "div",back = {},style = [""]){
  return(
    back.append(element)
      .attr('style',style)
  );
}





