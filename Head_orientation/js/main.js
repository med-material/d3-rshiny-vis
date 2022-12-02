//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-01-2022                             */
/*      Head_orientation                        */
/*      main.js                                 */
/*      v_1_2_2                                 */
//////////////////////////////////////////////////

// This program allows you to see some stats about the player's head orientation. 

    
var chartOptions = {
  
    windowSettings : {
        windowSection : {},
      
        height : 800,//px // height of the window
        width : 800,//px // width of the window
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
    
     headOrientationSettings : {
        height : 265,//px
        width : 550,//px
        
        marginTop : 290,//px
        marginLeft : 125,//px
        
        headSize : 80,//px
        headColor : "#b3b3b3",
        
        
        legendTopTextSize : 20,
        legendTopTextColor : "#000000",
        
        legendBottomTextSize : 26,
        legendBottomTextColor : "#000000",
        
        circleLineColor : "#b3b3b3",
        medianLineColor : "grey",
        
        greenColor : "#2BCC00",
        yellowColor : "#FFDA43",
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
    chartOptions.windowSettings.windowSection = utils.addElement("div",d3.select("body"),
              [
                "width:"+chartOptions.windowSettings.width+"px;"+
                "height:"+chartOptions.windowSettings.height+"px;"+
                "position: relative"
              ]
            );
  
    wall.updateLocalVariables(chartOptions.wallSettings);

    headOrientation.updateLocalVariables(chartOptions.headOrientationSettings);
};




function start(){

    // Program initialization
    initialization();
    
    
    // Create the wall section
    wall.createSection(chartOptions.windowSettings.windowSection);
    
    // Add moles to the wall      
    wall.addMolesToWall();
    
    
    // Create head orientation section
    headOrientation.createHeadOrientationSection(chartOptions.windowSettings.windowSection);
    
    // Add head orientation stats
    headOrientation.addHeadOrientationGraph();
};


//******************************************************************************
//******************************************************************************