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


    document.getElementById("pageGraph").remove();
    
    var back = utils.addElement("div",d3.select("body"),
                  [
                    "width:"+windowSettings.width+"px;"+
                    "height:"+windowSettings.height+"px;"+
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
      
    // create an section for graph  
    var headOrientationStatDiv = back.append('div') 
              .attr('style', 
                  "width:" +graphStat.graphSettings.width+"px;"+
                  "height:" +(graphStat.graphSettings.height)+"px;"+
                  "position:absolute;"+
                  "margin-left:"+(graphStat.graphSettings.marginLeft)+"px;"+
                  "margin-top:"+graphStat.graphSettings.marginTop+"px;"+
                  "background: rgb(50, 50, 50, 0)"
              );
    
    
    var graphWall = svg.append("g"); 
        
 

  
  
    
//******************************************************************************    
// Prog ************************************************************************    
    
           

    start(
      displayMoles=true,
      displayHeadPoint=true,
      displayFieldOfViewState=true
    );



//******************************************************************************
// Functions *******************************************************************



    
    function dataLoading(){ // read CSV files
      

    
        var yRotSort = data.hearCamRotSort;
 
    
        wall.wallSettings.xMax = data.wallInfo[1]["x_extrem"] + (data.wallInfo[1]["x_extrem"]/(data.wallInfo[0]["n_col_row"]))*2;
        wall.wallSettings.xMin = -wall.wallSettings.xMax;
        
        wall.wallSettings.yMax = data.wallInfo[1]["y_extrem"] + (data.wallInfo[1]["y_extrem"]/(data.wallInfo[1]["n_col_row"]))*2;
        wall.wallSettings.yMin = -wall.wallSettings.yMax;
      
        
        graphStat.graphSettings.yRotMax = yRotSort[parseInt(yRotSort.length-1)]; // retrieval of the largest value of the rotation values
       
        
        graphStat.graphSettings.yRotMin =  yRotSort[0]; // retrieval of the smallest value of the rotation values
        
        graphStat.graphSettings.yRotMedian = yRotSort[parseInt(yRotSort.length/2)]; // get median value
        graphStat.graphSettings.leastPresentValueLeft = yRotSort[parseInt(yRotSort.length*graphStat.graphSettings.leastPresentValuePercentage)];
        graphStat.graphSettings.leastPresentValueRight = yRotSort[parseInt(yRotSort.length - yRotSort.length*graphStat.graphSettings.leastPresentValuePercentage)];
        
        
        wall.wallSettings.yScale = d3.scaleLinear() // declare the wall domains
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
      
      
        wall.wallSettings.displayMoles = displayMoles;
        graphStat.graphSettings.displayHeadPoint = displayHeadPoint;
        graphStat.graphSettings.displayFieldOfViewState = displayFieldOfViewState;
        
        
        dataLoading();
        
        if(displayMoles)wall.addGraphMoles();
        
        if(displayHeadPoint)graphStat.addHeadPoint();
        
        if(displayFieldOfViewState)graphStat.addFieldOfViewState();
    }
    
    


//******************************************************************************
//******************************************************************************