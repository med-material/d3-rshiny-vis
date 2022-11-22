//////////////////////////////////////////////////
/*      Graph D3.js ControllerMovementV1_2_0    */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-22-2022                             */
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





var DataArrays = {
  
  idMoles : [], // list of all moles ID
  
  objMoles : [], // list of all moles obj (points into SVG) 

  objLaser : {}, // obj of laser

  objController : {}, // obj of controller 
  
 
  
  dateMin : {}, // first date into CSV files
  dateMax : {}, // last date into CSV files
  
  indexDate : {}, //curent date
  indexMole : 0, // curent lines into moles CSV file
  indexLaser : 0, // curent lines into laser CSV file
  indexController : 0,
}



var mouvementSettings = {
  isStart : false,
  index : 0,
}






//******************************************************************************
// Initialization **************************************************************






document.body.innerHTML = "";


var back = utils.addElement("div",d3.select("body"),
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

  
svg = utils.addElement("svg",back,
          [
            "width:"+ wall.wallSettings.width+"px;"+
            "height:"+ wall.wallSettings.height+"px;"+
            "position:absolute;"+
            "margin-left:"+( wall.wallSettings.marginLeft)+"px;"+
            "margin-top:"+ wall.wallSettings.marginTop+"px"
          ]
      );


var graphWall = utils.addElement("g",svg);

 
var graphControllerDiv = utils.addElement("div",back,
        [
          "width:" +graphController.graphSettings.width+"px;"+
          "height:" +graphController.graphSettings.height+"px;"+
          "position:absolute;"+
          "margin-left:"+(graphController.graphSettings.marginLeft)+"px;"+
          "margin-top:"+graphController.graphSettings.marginTop+"px;"
          // "background: rgb(50, 50, 50, 1)"
        ]
      );

 var graphControllerSvg = utils.addElement("svg",graphControllerDiv,
        [
          "width:"+graphController.graphSettings.width+"px;"+
          "height:"+graphController.graphSettings.height+"px;"+
          "position:absolute;"
        ]
      );   
 
 
    
    

  
  
    
//******************************************************************************    
// Prog ************************************************************************    



start();





//******************************************************************************
// Functions *******************************************************************







function dataLoading(data01){
  

  DataArrays.dateMin = new Date(data.ad[0]['Timestamp']);
  DataArrays.dateMax = new Date(data.ad[data.ad.length-2]['Timestamp']);
  
  slider.sliderSettings.n = (DataArrays.dateMax-DataArrays.dateMin)/14;
  

  DataArrays.indexDate = DataArrays.dateMin;
  
  
   wall.wallSettings.yScale = d3.scaleLinear()
		.domain([( wall.wallSettings.yMax), ( wall.wallSettings.yMin)]) 
		.range([(0), ( wall.wallSettings.height)]);
    			
   wall.wallSettings.xScale = d3.scaleLinear()
  	.domain([( wall.wallSettings.xMin), ( wall.wallSettings.xMax)]) 
  	.range([(0), ( wall.wallSettings.width)]);
  	
  
  	
  graphController.graphSettings.yScale = d3.scaleLinear()
		.domain([(graphController.graphSettings.valueMax/graphController.graphSettings.zoom), (-graphController.graphSettings.valueMax/graphController.graphSettings.zoom)]) 
		.range([(0), (graphController.graphSettings.height)]);
    			
  graphController.graphSettings.xScale = d3.scaleLinear()
  	.domain([(-graphController.graphSettings.valueMax/graphController.graphSettings.zoom), (graphController.graphSettings.valueMax/graphController.graphSettings.zoom)]) 
  	.range([(0), (graphController.graphSettings.width)]);
  	
  	
  slider.sliderSettings.dateScale = d3.scaleTime()
  .domain([new Date(0),new Date(DataArrays.dateMax.getTime() - DataArrays.dateMin.getTime())])
  .range([0, slider.sliderSettings.sliderWidth]);
  
}






























function start(){
  
  dataLoading(data);
 
  graphController.addControllerPath();
   wall.addGraphMoles();
   wall.addLaser();
  
  graphController.addAxis();
  
  graphController.addHeadPoint();
  graphController.addController();
  
  slider.addSlider();
  
  utils.clock();
  
}



window.startButtonOnclick = function(){
  mouvementSettings.isStart = !mouvementSettings.isStart;
 slider.changeStartButtonValues();
};



window.sliderChange = function(){
  
  if(mouvementSettings.isStart){
  
  }else{

    if(slider.sliderSettings.objSlider.value != mouvementSettings.index){
      
     wall.resetMoles();

      mouvementSettings.index = slider.sliderSettings.objSlider.value;
      
      DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index);
      
      DataArrays.indexMole = 0;
      DataArrays.indexLaser = 0;
      DataArrays.indexController = 0;

      
      if(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexLaser]['Timestamp'])){
        while(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexLaser]['Timestamp'])){
          DataArrays.indexLaser++
        }
      }
  
  
      if(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexController]['Timestamp'])){
        while(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexController]['Timestamp'])){
          DataArrays.indexController++
        }
      }
  
      wall.changeLaserLocation();
      graphController.changeControllerLocation();
      
      mouvementSettings.isStart = true;
      
      setTimeout(function(){mouvementSettings.isStart = false;},100);
  
    }
  }
};










//******************************************************************************
//******************************************************************************




