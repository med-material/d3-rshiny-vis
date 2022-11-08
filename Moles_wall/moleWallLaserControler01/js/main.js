//////////////////////////////////////////////////
/*      Graph D3.js moleWallLaserControler01    */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      oct-21-2022                             */
/*      main.js                                 */
//////////////////////////////////////////////////

//





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
  zoom : 1.5,
  
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
  
  objStartButton : {},
  sBtnHeight : 50,//px
  sBtnWidth : 100,//px
  sBtnMargingTop : 5,//px
  sBtnMargingLeft : 0,
  
  objSlider : {},
  sliderHeight : 50,//px
  sliderWidth : "auto",
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


var back = d3.select("body").append("div")
  .attr('style', 
      "width:"+windowSettings.width+
      "px;height:"+windowSettings.height+
      "px;background-image: url("+windowSettings.backgroundPicURL+");"+
      "background-repeat: no-repeat;"+
      "background-position: center;"+
      "background-size: 100% 100%;"+
      "position: relative"
  );
  
  
svg = back.append('svg')
  .attr("width", wallSettings.width)
  .attr("height", wallSettings.height)
  .attr('style', 
      "position:absolute;"+
      "margin-left:"+(wallSettings.marginLeft)+"px;"+
      "margin-top:"+wallSettings.marginTop+"px"
  );
  
  
div = back.append('div')
  .attr('style', 
      "width:" +graphSettings.width+"px;"+
      "height:" +graphSettings.height+"px;"+
      "position:absolute;"+
      "margin-left:"+(graphSettings.marginLeft)+"px;"+
      "margin-top:"+graphSettings.marginTop+"px;"
     // "background: rgb(50, 50, 50, 1)"
  );


var graphWall = svg.append("g");
    
var graphController = div;

var graphControllerSvg = graphController.append('svg')
    .attr("width", graphSettings.width)
  .attr("height", graphSettings.height)
  .attr('style', 
      "position:absolute;"
  );  
    
 
 
    
    

  
  
    
//******************************************************************************    
// Prog ************************************************************************    
    
    
    


start();





//******************************************************************************
// Functions *******************************************************************






function addGraphMoles() {

	var mole = {};
	
	DataArrays.idMoles.forEach(function(e,i){
    
   mole = graphWall.append('circle')
    .attr('cx', function(d) { return getMolesCoordPx(i)[0]; })
		.attr('cy', function(d) { return getMolesCoordPx(i)[1]; })
		.attr('r', wallSettings.pointSize)
		.attr('fill', wallSettings.pointColor);
		
		DataArrays.objMoles.push(mole);
    
  });
}





function addLaser(){
  
  var laser = {};
  
  laser = graphWall.append('circle')
    .attr('cx', -100)
    .attr('cy', -100)
    .attr('r', wallSettings.laserSize)
    .attr('fill', wallSettings.laserColor);
	
	DataArrays.objLaser = laser;
		
}

function addController(){

  var controller = {};
   
  controller = graphController.append('div')
      .attr('id', "controller2")
      .attr('style', "left:"+200+"px;top:"+200+"px;display: flex;position:absolute;background: rgb(50, 50, 50, 00);width:"+(graphSettings.controllerWidth)+"px;height:"+(graphSettings.controllerHeight)+"px;justify-content: center;align-items: flex-top;background-image: url("+graphSettings.ControllerPicURL+");background-repeat: no-repeat;background-position: center;background-size: 100% 100%;");
      
      DataArrays.objController = controller;

}


function addControllerPath(){
 // console.log("eeeeeeeeee")
 

 
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
     graphController.append('div')
      .attr('id', "headPoint")
      .attr('style', "left:"+((graphSettings.width/2)-((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))/2)+"px;top:"+((graphSettings.height/2)-((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))/2)+"px;display: flex;position:absolute;background: rgb(50, 50, 50, 1);width:"+((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))+"px;height:"+((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))+"px;border-radius:"+(((0.2*graphSettings.width)/((graphSettings.valueMax/graphSettings.zoom)*2))/2)+"px");
}




function addSlider(){
  var divSlider = back.append('div')
  .attr('id', "divSlider")
  .attr('style', "display: flex;position:absolute;background: rgb(50, 50, 50, 0);width:"+sliderSettings.width+"px;height:"+(sliderSettings.height)+"px;margin-top:"+sliderSettings.marginTop+"px;margin-left:"+sliderSettings.marginLeft+"px;justify-content: center;align-items: flex-top");
  
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
  .attr('style', "width:"+sliderSettings.sliderWidth+"px;height:"+sliderSettings.sliderHeight+"px;margin-top:"+sliderSettings.sliderMargingTop+"px;margin-left:"+sliderSettings.sliderMargingLeft+"px");
  
  
    sliderSettings.objStartButton = document.getElementById('startButton');
  changeStartButtonValues();
  
  sliderSettings.objSlider = document.getElementById('slider');
  
  
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
    
  //graphSettings.AxisIdList.push("abscisseAxis");
 
  
  

  
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
      
 // graphSettings.AxisIdList.push("ordinateAxis");
   
  
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

//console.log(DataArrays.xController[i]+" : "+DataArrays.zController[i])
  return coord;

}














function dataLoading(data01){
  
  data.am.forEach(element => { 
    DataArrays.idMoles.push(element.id);
    DataArrays.xMoles.push(element.x);
    DataArrays.yMoles.push(element.y);
  });
  

  
  data.aed.forEach((element,index) => { 

    
    //DataArrays.changeIdMoles.push(parseInt(element.CurrentMoleToHitId));
    DataArrays.changeIdMoles.push(parseInt(element.MoleId));
    DataArrays.changeEventMoles.push(element.Event);
    
    DataArrays.moleDate.push(new Date(element.Timestamp));

  });
  
    data.ad.forEach((element,index) => { 
    //console.log("e")
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
    
    
   
    //DataArrays.yLaser.push(element[index].RightControllerLaserPosWorldY);
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
    
    
    //DataArrays.yControllerRot.push(element.RightControllerRotEulerZ);
    DataArrays.controllerDate.push(new Date(element.Timestamp));

  });
  
  
  DataArrays.dateMin = new Date(Math.min(...DataArrays.laserDate));
  DataArrays.dateMax = new Date(Math.max(...DataArrays.laserDate));
  
  sliderSettings.n = (DataArrays.dateMax-DataArrays.dateMin)/14;
  
  //console.log(sliderSettings.n);
  
 // console.log(new Date(DataArrays.dateMin)+"fffffffffffffffffffffffffffff")
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
  	
  	
  
}






function changeMolesState(){

  
  if(new Date(DataArrays.indexDate) >= new Date(DataArrays.moleDate[DataArrays.indexMole])){
    //console.log("cm1")
    while(new Date(DataArrays.indexDate) >= new Date(DataArrays.moleDate[DataArrays.indexMole])){
      //console.log("cm2")
      //if(DataArrays.changeIdMoles[DataArrays.indexMole] == "602")console.log(DataArrays.changeEventMoles[DataArrays.indexMole] + " : " + DataArrays.changeIdMoles[DataArrays.indexMole])
      switch(DataArrays.changeEventMoles[DataArrays.indexMole]){
        
        case "Mole Spawned":
          //console.log(DataArrays.changeEventMoles[DataArrays.indexMole] + " : " + DataArrays.changeIdMoles[DataArrays.indexMole])
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].transition()
          .duration(1000)
          .attr('fill', "green");
          DataArrays.indexMole++;
          
          break;
          
        case "Fake Mole Spawned":
          //console.log(DataArrays.changeEventMoles[DataArrays.indexMole] + " : " + DataArrays.changeIdMoles[DataArrays.indexMole])
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].transition()
          .duration(1000)
          .attr('fill', "#FFFB00");
          DataArrays.indexMole++;
          
          break;
        
        case "Mole Expired":
          //console.log(DataArrays.changeEventMoles[DataArrays.indexMole] + " : " + DataArrays.changeIdMoles[DataArrays.indexMole])
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].transition()
          .duration(1000).attr('fill', wallSettings.pointColor);
          DataArrays.indexMole++
          break;
          
        case "Fake Mole Expired":
          //console.log(DataArrays.changeEventMoles[DataArrays.indexMole] + " : " + DataArrays.changeIdMoles[DataArrays.indexMole])
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].transition()
          .duration(1000).attr('fill', wallSettings.pointColor);
          DataArrays.indexMole++
          break;
        
        case "Mole Hit":
          //console.log(DataArrays.changeEventMoles[DataArrays.indexMole] + " : " + DataArrays.changeIdMoles[DataArrays.indexMole])
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].attr('fill', "orange");
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].transition()
          .duration(1000).attr('fill', wallSettings.pointColor);
          DataArrays.indexMole++
          break;
          
        case "Fake Mole Hit":
          //console.log(DataArrays.changeEventMoles[DataArrays.indexMole] + " : " + DataArrays.changeIdMoles[DataArrays.indexMole])
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].attr('fill', "red");
          DataArrays.objMoles[DataArrays.idMoles.indexOf(DataArrays.changeIdMoles[DataArrays.indexMole])].transition()
          .duration(1000).attr('fill', wallSettings.pointColor);
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
  
  //console.log(new Date(DataArrays.laserDate[DataArrays.indexLaser]).getMilliseconds())

  if(new Date(DataArrays.indexDate) >= new Date(DataArrays.laserDate[DataArrays.indexLaser])){
    //console.log("ll1")
    while(new Date(DataArrays.indexDate) >= new Date(DataArrays.laserDate[DataArrays.indexLaser])){
    
    //console.log("ll2")
      DataArrays.objLaser.transition()
      .duration(14)
      .attr('cx', function(d) { return getLaserCoordPx(DataArrays.indexLaser )[0]; })
      .attr('cy', function(d) { return getLaserCoordPx(DataArrays.indexLaser )[1]; });
      
      DataArrays.indexLaser++
      
    }
  }
}



function changeControllerLocation(){
  //console.log(getControllerCoordPx(DataArrays.indexController)[0] + getControllerCoordPx(DataArrays.indexController)[1])
  if(new Date(DataArrays.indexDate) >= new Date(DataArrays.controllerDate[DataArrays.indexController])){
    //console.log("cl1")
    while(new Date(DataArrays.indexDate) >= new Date(DataArrays.controllerDate[DataArrays.indexController])){

//console.log("cl2")
      
      
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
  //console.log("ic :"+DataArrays.indexController+"  il :"+DataArrays.indexLaser+"   im :"+DataArrays.indexMole)
  
  
  //DataArrays.indexDate.setMilliseconds(DataArrays.indexDate.getMilliseconds() + 14); // add 100  Msecond to the curent index date  
  //console.log(new Date(DataArrays.indexDate).toString())
  
  mouvementSettings.index ++;
  DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index); // add 100  Msecond to the curent index date 
  //console.log(DataArrays.indexDate)
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
  
  //changeStartButtonValues();
  
  clock();
  
}





window.startButtonOnclick = function(){
  mouvementSettings.isStart = !mouvementSettings.isStart;
  changeStartButtonValues();
}



window.sliderChange = function(){
  //console.log("eeeeeeeeeeee")
  
  if(mouvementSettings.isStart){

  
  }else{
    
    
    
    if(sliderSettings.objSlider.value != mouvementSettings.index){
      
      resetMoles();

      //sliderSettings.sliderValue = document.getElementById("slider").value;
      mouvementSettings.index = sliderSettings.objSlider.value;
      
      DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index);
      
      DataArrays.indexMole = 0;
      DataArrays.indexLaser = 0;
      DataArrays.indexController = 0;
     /* 
      if(new Date(DataArrays.indexDate) >= new Date(DataArrays.moleDate[DataArrays.indexMole])){
    
    while(new Date(DataArrays.indexDate) >= new Date(DataArrays.moleDate[DataArrays.indexMole])){
      //console.log("eeeeeeeeeeeeeee")
      DataArrays.indexMole ++;
      
    }
      }
      */
      
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
  
  
     /* DataArrays.indexMole -= 100;
      DataArrays.indexLaser -= 100;
      DataArrays.indexController -= 100;*/
      changeLaserLocation();
      //changeMolesState();
      changeControllerLocation();
      
      mouvementSettings.isStart = true;
      //changeStartButtonValues();
      
      setTimeout(function(){mouvementSettings.isStart = false;},100);
      
  //setTimeout(function(){resetMoles();},1000);
      
      
    }
  }
}





//******************************************************************************
//******************************************************************************