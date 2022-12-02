//////////////////////////////////////////////////
/*      Graph D3.js ControllerMovement          */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-01-2022                             */
/*      main.js                                 */
/*      v_1_2_3                                 */
//////////////////////////////////////////////////

//Allows visualization of controller movement and mole states.


//******************************************************************************
// Variables *******************************************************************


var ChartOptions = {
  
    windowSettings : {
        windowSection : {},
      
        height : 800,//px // height of the window
        width : 800,//px // width of the window
        
        backgroundPicURL : "img/fond06.png", // background img of the window
    },
    
    wallSettings : {
        height : 250,//px // height of the graph
        width : 750,//px // width of the graph
        
        marginTop : 10,//px // margin of the graph compared to the top of the window
        marginLeft : 25,//px // margin of the graph compared to the left of the window
        
        molesSize : 20,//px
        molesColor : "#D6D6D6", // default color of the moles
        
        laserSize : 10,//px
        laserColor : "red", // default color of the laser
    },
    
    graphSettings : {
        height : 446,//px
        width : 446,//px
        
        marginTop : 273,//px
        marginLeft : 175,//px
        
        zoom : 1.6,
        
        pointSize : 2,//px
        pointColor : "#0055FF11", 
        
        
        controllerPicURL : "img/controller.png",
        controllerHeight : 40,//px
        controllerWidth : 40,//px
    },
    
    sliderSettings : {
        height : 60,//px
        width : 450,//px
        
        marginTop : 720,//px
        marginLeft : 175,//px
        
        sBtnHeight : 50,//px
        sBtnWidth : 100,//px
        sBtnMargingTop : 5,//px
        sBtnMargingLeft : 0,
        
        sliderHeight : 50,//px
        sliderWidth : 330,
        sliderMargingTop : 5,//px
        sliderMargingLeft : 10,//px
    },
    
    DataArrays : {
        dateMin : {}, // first date into CSV files
        dateMax : {}, // last date into CSV files
        
        indexDate : {}, //curent date
    },
    
    mouvementSettings : {
        isStart : false,
        index : 0,
    },
};





  
    
//******************************************************************************    
// Prog ************************************************************************    



start();



//******************************************************************************
// Functions *******************************************************************


// Initialize the local variables of each class
function initialization(){
  
    // Delete content created by R2D3 to do it myself
    document.getElementById("pageGraph").remove();
  
    // Create a DIV as a background
    ChartOptions.windowSettings.windowSection = utils.addElement("div",d3.select("body"),
              [
                "width:"+ChartOptions.windowSettings.width+"px;"+
                "height:"+ChartOptions.windowSettings.height+"px;"+
                "position: relative"
              ]
            );
            
    // Get date min and max
    ChartOptions.DataArrays.dateMin = new Date(data.ad[0]['Timestamp']);
    ChartOptions.DataArrays.dateMax = new Date(data.ad[data.ad.length-2]['Timestamp']);
    
    // Initialize index date
    ChartOptions.DataArrays.indexDate = ChartOptions.DataArrays.dateMin;
    
    // Update all variables
    wall.updateLocalVariables(ChartOptions.wallSettings);
    
    graphController.updateLocalVariables(ChartOptions.graphSettings);
    
    slider.updateLocalVariables(ChartOptions.sliderSettings);
};


function start(){
  
    // Program initialization
    initialization();
    
    
    // Create the wall section
    wall.createSection(ChartOptions.windowSettings.windowSection);
    
    // Add moles to the wall      
    wall.addMolesToWall();
    
    // Add laser to the wall
    wall.addLaser();
    
    
    // Create a section for the controller graph
    graphController.createSection(ChartOptions.windowSettings.windowSection);

    // Add graph border
    graphController.addGraphBorder();

    // Add axis to the graph
    graphController.addAxis();
    
    // Add controller Path
    graphController.addControllerPath();
    
    // Add head point to the graph
    graphController.addHeadPoint();
    
    // Add controller to the graph
    graphController.addController();
    
    
    // Create a section for the scrollbar
    slider.createSection(ChartOptions.windowSettings.windowSection);
    
    // Add a button start/stop
    slider.addButton();
    
    // Add scrollbar
    slider.addSlider();


    // Start clock
    clock();
}


function clock(){
  
    // If is start
    if(ChartOptions.mouvementSettings.isStart){
    
        // Change laser's location
        wall.changeLaserLocation();
        
        // Change mole's location
        wall.changeMolesState();
        
        // Change controller's location
        graphController.changeControllerLocation();
        
        ChartOptions.mouvementSettings.index ++;
        
        // Add 100  Msecond to the curent index date
        ChartOptions.DataArrays.indexDate = new Date(ChartOptions.DataArrays.dateMin.getTime() + 14*ChartOptions.mouvementSettings.index);  
      
        // save slider value
        slider.sliderSettings.objSlider.value = ChartOptions.mouvementSettings.index;
    };
    
    // Call clock function in 14 ms
    setTimeout(clock, 14);
};




window.startButtonOnclick = function(){
    ChartOptions.mouvementSettings.isStart = !ChartOptions.mouvementSettings.isStart;
    slider.changeStartButtonValues();
};



window.sliderChange = function(){
  
    if(ChartOptions.mouvementSettings.isStart){
    
    }else{
  
      if(slider.sliderSettings.objSlider.value != ChartOptions.mouvementSettings.index){
        
          // Reset moles
          wall.resetMoles();
    
          ChartOptions.mouvementSettings.index = slider.sliderSettings.objSlider.value;
          
          // Add 14 ms to the index date
          ChartOptions.DataArrays.indexDate = new Date(ChartOptions.DataArrays.dateMin.getTime()  + 14*ChartOptions.mouvementSettings.index);
          
          // Reset all indexes
          wall.settings.indexMole = 0;
          wall.settings.indexLaser = 0;
          graphController.graphSettings.indexController = 0;
    
          // If the target date is less than the date in the laser's index of events
          if(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.ad[wall.settings.indexLaser]['Timestamp'])){
              while(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.ad[wall.settings.indexLaser]['Timestamp'])){
                  wall.settings.indexLaser++;
              };
          };
      
      
          // If the target date is less than the date in the controller's index of events
          if(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.ad[graphController.graphSettings.indexController]['Timestamp'])){
              while(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.ad[graphController.graphSettings.indexController]['Timestamp'])){
                  graphController.graphSettings.indexController++;
              };
          };
      
          wall.changeLaserLocation();
          graphController.changeControllerLocation();
          
          
          // To make a smooth transition        
          ChartOptions.mouvementSettings.isStart = true;
          setTimeout(function(){ChartOptions.mouvementSettings.isStart = false;},100);
      
        };
    };
};


//******************************************************************************
//******************************************************************************