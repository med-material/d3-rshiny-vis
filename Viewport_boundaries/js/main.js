//////////////////////////////////////////////////
/*      Graph D3.js ViewportBoundaries          */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-09-2022                             */
/*      main.js                                 */
/*      v_1_0_1                                 */
//////////////////////////////////////////////////

//


//******************************************************************************
// Variables *******************************************************************


var ChartOptions = {
  
    windowSettings : {
        windowSection : {},
      
        height : 600,//px // height of the window
        width : 800,//px // width of the window
    },
    
    wallSettings : {
        height : 450,//px // height of the graph
        width : 750,//px // width of the graph
        
        marginTop : 10,//px // margin of the graph compared to the top of the window
        marginLeft : 25,//px // margin of the graph compared to the left of the window
        
        molesSize : 20,//px
        molesColor : "#D6D6D6", // default color of the moles
        
        laserSize : 10,//px
        laserColor : "red", // default color of the laser
        
        borderSize : 2,//px
        borderColor : "grey",
        
        viewportBoundariesBorderSize : 5,//px
        viewportBoundariesBorderColor : "grey",
        viewportBoundariesBackColor : "#00000000",
    },
    
    sliderSettings : {
        height : 60,//px
        width : 450,//px
        
        marginTop : 500,//px
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
    
    mouvementSettings : {
        isStart : false,
        index : 0,
    },
    
    dateMin : {}, // first date into CSV files
    dateMax : {}, // last date into CSV files
    
    indexDate : {}, //curent date
};





  
    
//******************************************************************************    
// Prog ************************************************************************    



start();



//******************************************************************************
// Functions *******************************************************************


// Initialize the local variables of each class
function initialization(){
  
    // Delete svg created by R2D3
    document.getElementById("pageGraph").getElementsByTagName("svg")[0].remove();
    

    // Create a DIV as a background
    ChartOptions.windowSettings.windowSection = utils.addElement("div",d3.select("#pageGraph"),
              [
                "width:"+ChartOptions.windowSettings.width+"px;"+
                "height:"+ChartOptions.windowSettings.height+"px;"+
                "position: relative"
              ]
            );
    
    
    // Get date min and max
    ChartOptions.dateMin = new Date(data.ad[0]['Timestamp']);
    ChartOptions.dateMax = new Date(data.ad[data.ad.length-2]['Timestamp']);
    
    // Initialize index date
    ChartOptions.indexDate = ChartOptions.dateMin;
    
    // Update all variables
    wall.updateLocalVariables(ChartOptions.wallSettings);
    
    slider.updateLocalVariables(ChartOptions.sliderSettings);
};


function start(){
  
    // Program initialization
    initialization();
    
    
    // Create the wall section
    wall.createSection(ChartOptions.windowSettings.windowSection);
    
    wall.addWallBorder();
    
    // Add moles to the wall      
    wall.addMolesToWall();
    

    wall.addViewportBoundaries();
    
    // Add laser to the wall
    wall.addLaser();
    
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
      
    
        wall.changeMolesState();

        wall.changeViewportBoundariesLocation();
        
        // Change laser's location
        wall.changeLaserLocation();
      
        
        ChartOptions.mouvementSettings.index ++;
        
        // Add 100  Msecond to the curent index date
        ChartOptions.indexDate = new Date(ChartOptions.dateMin.getTime() + 14*ChartOptions.mouvementSettings.index);  
        
        // save slider value
        slider.element.objSlider.value = ChartOptions.mouvementSettings.index;
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
  
      if(slider.element.objSlider.value != ChartOptions.mouvementSettings.index){
        
          // Reset moles
          wall.resetMoles();
    
          ChartOptions.mouvementSettings.index = slider.element.objSlider.value;
          
          // Add 14 ms to the index date
          ChartOptions.indexDate = new Date(ChartOptions.dateMin.getTime()  + 14*ChartOptions.mouvementSettings.index);
          
          // Reset all indexes
          wall.indexMole = 0;
          wall.indexLaser = 0;
          wall.indexViewportBoundaries = 0;
    

          if(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexViewportBoundaries]['Timestamp'])){
              while(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexViewportBoundaries]['Timestamp'])){
                  wall.indexViewportBoundaries++;
              };
          };
      
          // If the target date is less than the date in the laser's index of events
          if(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexLaser]['Timestamp'])){
              while(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexLaser]['Timestamp'])){
                  wall.indexLaser++;
              };
          };
      
      
          wall.changeViewportBoundariesLocation();
          wall.changeLaserLocation();
          
          // To make a smooth transition        
          ChartOptions.mouvementSettings.isStart = true;
          setTimeout(function(){ChartOptions.mouvementSettings.isStart = false;},100);
      
        };
    };
};


//******************************************************************************
//******************************************************************************