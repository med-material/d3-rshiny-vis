//////////////////////////////////////////////////
/*      Graph D3.js Head_orientation_v1_2_1     */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-29-2022                             */
/*      main.js                                 */
//////////////////////////////////////////////////

//



//******************************************************************************
// Variables *******************************************************************


    var windowSettings= {
        height : 800,//px // height of the window
        width : 800,//px // width of the window
    };



//******************************************************************************
// Initialization **************************************************************


    // Delete content created by R2D3 to do it myself
    document.getElementById("pageGraph").remove();
    
    
    // Create a DIV as a background
    var back = utils.addElement("div",d3.select("body"),
                  [
                    "width:"+windowSettings.width+"px;"+
                    "height:"+windowSettings.height+"px;"+
                    "position: relative"
                  ]
                );
                
    // Add SVG for wall display   
    var svg = utils.addElement("svg",back,
              [
                "width:"+ wall.wallSettings.width+"px;"+
                "height:"+ wall.wallSettings.height+"px;"+
                "position:absolute;"+
                "margin-left:"+( wall.wallSettings.marginLeft)+"px;"+
                "margin-top:"+ wall.wallSettings.marginTop+"px"
              ]
          );
          
    // Add work area 'g' for wall display
    var graphWall = svg.append("g"); 
      
    // Create an section for graph  
    var headOrientationStatDiv = back.append('div') 
              .attr('style', 
                  "width:" +graphStat.graphSettings.width+"px;"+
                  "height:" +(graphStat.graphSettings.height)+"px;"+
                  "position:absolute;"+
                  "margin-left:"+(graphStat.graphSettings.marginLeft)+"px;"+
                  "margin-top:"+graphStat.graphSettings.marginTop+"px;"+
                  "background: rgb(50, 50, 50, 0)"
              );
    
    
    
        
 

  
  
    
//******************************************************************************    
// Prog ************************************************************************    
    
           

    start(
      displayMoles=true,
      displayHeadPoint=true,
      displayFieldOfViewState=true
    );



//******************************************************************************
// Functions *******************************************************************



    
    function dataLoading(){ // Read CSV files
      

        // Sorted Y rotation array
        var yRotSort = data.hearCamRotSort;
 
        // Calculation of the extreme values of the wall
        //                     =                       Xmax   +   the size of a mole * 2
        wall.wallSettings.xMax = data.wallInfo[1]["x_extrem"] + (data.wallInfo[1]["x_extrem"]/(data.wallInfo[0]["n_col_row"]))*2;
        wall.wallSettings.xMin = -wall.wallSettings.xMax;
        
        wall.wallSettings.yMax = data.wallInfo[1]["y_extrem"] + (data.wallInfo[1]["y_extrem"]/(data.wallInfo[1]["n_col_row"]))*2;
        wall.wallSettings.yMin = -wall.wallSettings.yMax;
      
        // Retrieval of the largest value of the rotation values
        graphStat.graphSettings.yRotMax = yRotSort[parseInt(yRotSort.length-1)];
       
        // Retrieval of the smallest value of the rotation values
        graphStat.graphSettings.yRotMin =  yRotSort[0]; 
        
        // Get median value
        graphStat.graphSettings.yRotMedian = yRotSort[parseInt(yRotSort.length/2)];
        
        // Get least present value left
        graphStat.graphSettings.leastPresentValueLeft = yRotSort[parseInt(yRotSort.length*graphStat.graphSettings.leastPresentValuePercentage)];
        
        // Get least present value right
        graphStat.graphSettings.leastPresentValueRight = yRotSort[parseInt(yRotSort.length - yRotSort.length*graphStat.graphSettings.leastPresentValuePercentage)];
        
        // Declaration of the wall domains
        wall.wallSettings.yScale = d3.scaleLinear() 
          .domain([(wall.wallSettings.yMax), (wall.wallSettings.yMin)]) 
          .range([(0), (wall.wallSettings.height)]);
        
        wall.wallSettings.xScale = d3.scaleLinear()
          .domain([(wall.wallSettings.xMin), (wall.wallSettings.xMax)]) 
          .range([(0), (wall.wallSettings.width)]);
    
    }
    
    
    
    
    function start(
            displayMoles = wall.wallSettings.displayMoles,
            displayHeadPoint = graphStat.graphSettings.displayHeadPoint,
            displayFieldOfViewState = graphStat.graphSettings.displayFieldOfViewState
        ){
      
      
        // Update display values
        wall.wallSettings.displayMoles = displayMoles;
        graphStat.graphSettings.displayHeadPoint = displayHeadPoint;
        graphStat.graphSettings.displayFieldOfViewState = displayFieldOfViewState;
        
        // Loading of data useful for the operation of the program
        dataLoading();
        
        
        // Add moles to the wall
        if(displayMoles)wall.addGraphMoles();
        
        
        // Add head point to the wall
        if(displayHeadPoint)graphStat.addHeadPoint();
        
        // Add head orientation stats to the wall
        if(displayFieldOfViewState)graphStat.addFieldOfViewState();
    }
    
    


//******************************************************************************
//******************************************************************************