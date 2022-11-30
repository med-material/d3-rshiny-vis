//////////////////////////////////////////////////
/*      Graph D3.js ControllerMovement          */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-22-2022                             */
/*      main.js                                 */
/*      v_1_2_2                                 */
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






// Delete content created by R2D3 to do it myself
document.getElementById("pageGraph").remove();
    

// Create a DIV as a background
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


// Add SVG for wall display  
svg = utils.addElement("svg",back,
          [
            "width:"+ wall.wallSettings.width+"px;"+
            "height:"+ wall.wallSettings.height+"px;"+
            "position:absolute;"+
            "margin-left:"+( wall.wallSettings.marginLeft)+"px;"+
            "margin-top:"+ wall.wallSettings.marginTop+"px"
          ]
      );

// Add work area 'g' for wall display
var graphWall = utils.addElement("g",svg);


// Create an DIV for graph 
var graphControllerDiv = utils.addElement("div",back,
        [
          "width:" +graphController.graphSettings.width+"px;"+
          "height:" +graphController.graphSettings.height+"px;"+
          "position:absolute;"+
          "margin-left:"+(graphController.graphSettings.marginLeft)+"px;"+
          "margin-top:"+graphController.graphSettings.marginTop+"px;"
        ]
      );

// Create an SVG for graph
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






// Read CSV files
function dataLoading(data01){
  
  // Get date min and max
  DataArrays.dateMin = new Date(data.ad[0]['Timestamp']);
  DataArrays.dateMax = new Date(data.ad[data.ad.length-2]['Timestamp']);
  
  // Calculating the number of values for the slider
  slider.sliderSettings.n = (DataArrays.dateMax-DataArrays.dateMin)/14;
  

  DataArrays.indexDate = DataArrays.dateMin;
  
  // Declaration of the wall domains
   wall.wallSettings.yScale = d3.scaleLinear()
		.domain([( wall.wallSettings.yMax), ( wall.wallSettings.yMin)]) 
		.range([(0), ( wall.wallSettings.height)]);
    			
   wall.wallSettings.xScale = d3.scaleLinear()
  	.domain([( wall.wallSettings.xMin), ( wall.wallSettings.xMax)]) 
  	.range([(0), ( wall.wallSettings.width)]);
  	
  
  // Declaration of the graph domains
  graphController.graphSettings.yScale = d3.scaleLinear()
		.domain([(graphController.graphSettings.valueMax/graphController.graphSettings.zoom), (-graphController.graphSettings.valueMax/graphController.graphSettings.zoom)]) 
		.range([(0), (graphController.graphSettings.height)]);
    			
  graphController.graphSettings.xScale = d3.scaleLinear()
  	.domain([(-graphController.graphSettings.valueMax/graphController.graphSettings.zoom), (graphController.graphSettings.valueMax/graphController.graphSettings.zoom)]) 
  	.range([(0), (graphController.graphSettings.width)]);
  	
// Declaration of the slider domains
  slider.sliderSettings.dateScale = d3.scaleTime()
  .domain([new Date(0),new Date(DataArrays.dateMax.getTime() - DataArrays.dateMin.getTime())])
  .range([0, slider.sliderSettings.sliderWidth]);
  
}






























function start(){
  
  // Loading of data useful for the operation of the program
  dataLoading();
 
  // Add controller Path
  graphController.addControllerPath();
  
  // Add moles to the wall
  wall.addGraphMoles();
  
  // Add laser to the wall
  wall.addLaser();
  
  // Add axis to the graph
  graphController.addAxis();
  
  
  // Add head point to the graph
  graphController.addHeadPoint();
  
  // Add controller to the graph
  graphController.addController();
  
  // Add slider to the graph
  slider.addSlider();
  
  // Start clock
  clock();
  
}



 function clock(){
  
  // If is start
  if(mouvementSettings.isStart){
  
      // Change laser's location
      wall.changeLaserLocation();
      
      // Change mole's location
      wall.changeMolesState();
      
      // Change controller's location
      graphController.changeControllerLocation();
      
      mouvementSettings.index ++;
      
      // Add 100  Msecond to the curent index date
      DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index);  
    
      // save slider value
      slider.sliderSettings.objSlider.value = mouvementSettings.index;
  }
  
  // Call clock function in 14 ms
  setTimeout(clock, 14);
  
}




window.startButtonOnclick = function(){
    mouvementSettings.isStart = !mouvementSettings.isStart;
    slider.changeStartButtonValues();
};



window.sliderChange = function(){
  
  if(mouvementSettings.isStart){
  
  }else{

    if(slider.sliderSettings.objSlider.value != mouvementSettings.index){
      
        // Reset moles
        wall.resetMoles();
  
        mouvementSettings.index = slider.sliderSettings.objSlider.value;
        
        // Add 14 ms to the index date
        DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index);
        
        // Reset all indexes
        DataArrays.indexMole = 0;
        DataArrays.indexLaser = 0;
        DataArrays.indexController = 0;
  
        // If the target date is less than the date in the laser's index of events
        if(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexLaser]['Timestamp'])){
            while(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexLaser]['Timestamp'])){
                DataArrays.indexLaser++
            }
        }
    
    
        // If the target date is less than the date in the controller's index of events
        if(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexController]['Timestamp'])){
            while(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexController]['Timestamp'])){
                DataArrays.indexController++
            }
        }
    
        wall.changeLaserLocation();
        graphController.changeControllerLocation();
        
        
        // To make a smooth transition        
        mouvementSettings.isStart = true;
        setTimeout(function(){mouvementSettings.isStart = false;},100);
    
      }
  }
};










//******************************************************************************
//******************************************************************************




