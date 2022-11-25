//////////////////////////////////////////////////
/*      Graph D3.js headOrientationStat_v1_0_0  */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-23-2022                             */
/*      main.js                                 */
//////////////////////////////////////////////////

//



//******************************************************************************
// Variables *******************************************************************


    var windowSettings= {
        height : 800,//px // height of the window
        width : 800,//px // width of the window
        
        backgroundPicURL : "img/fond07.png", // background img of the window
    };



    var graphSettings={
        height : 265,//px
        width : 550,//px
        
        marginTop : 290,//px
        marginLeft : 125,//px
        
        
        valueMax : 2,
        
        
        headSize : 80,//px
        headColor : "#757575",
      
      
        displayHeadPoint : false,
        displayFieldOfViewState : false,
    
    }


    
    var DataArrays = {
      
        idMoles : [], // list of all moles ID
        xMoles : [], // list of all moles position X 
        yMoles : [], // list of all moles position y
        objMoles : [], // list of all moles obj (points into SVG) 
      
        
        yHeadRot : [], // rotate value of the head
        leastPresentValuePercentage : 0.12, // % of the least representative values
        leastPresentValueLeft : 0, // value at which "leastPresentValuePercentage"% of all values are less than it
        leastPresentValueRight : 0, // value at which "1-leastPresentValuePercentage"% of all values are greater than it
        yRotMedian : 0, // median of the rotation value
        yRotMin : 0, // value min
        yRotMax : 0, // value max
      
    }






//******************************************************************************
// Initialization **************************************************************




    document.body.innerHTML = ""; //reset the body
    
    
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
      
      
    var headOrientationStatDiv = back.append('div') // create an section for graph
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
    
           


    start(data,{ // start function
      displayMoles:true,
      displayHeadPoint:true,
      displayFieldOfViewState:true,
      displayAxis:false,
    });





//******************************************************************************
// Functions *******************************************************************



 
    
    function addFieldOfViewState(){ // add Field Of View State on the graph
        
        const degrees_to_radians = deg => (deg * Math.PI) / 180.0;
        
        var graphStat =  headOrientationStatDiv // add SVG section on the graph (to add D3 point inside)
                      .append("svg")
                      .attr('id', "addFieldOfViewState")
                      .attr("width", graphSettings.width)
                      .attr("height", graphSettings.height)
                      .append("g")
                      .attr("transform", "translate(" + graphSettings.width / 2 + "," + graphSettings.height+ ")");
                      
        var graphLegend =  headOrientationStatDiv // add SVG section on the graph (to add D3 point inside)
                      .append("svg")
                      .attr('id', "addFieldOfViewStateLegend")
                      .attr("width", graphSettings.width)
                      .attr("height", (graphSettings.height +50))
                      .attr("style", "position:absolute;margin-left:"+(-graphSettings.width)+"px;margin-top:"+(-50)+"px")
                      .append("g")
                      .attr("transform", "translate(" + graphSettings.width / 2 + "," + (graphSettings.height + 50)+ ")");
        
        
        var arc1 = d3.arc() // define the 1st acr
                      .innerRadius(0)
                      .outerRadius(graphSettings.height - 4)
                      .startAngle(degrees_to_radians(DataArrays.yRotMin))
                      .endAngle(degrees_to_radians(DataArrays.leastPresentValueLeft));
        
        
        var arc2 = d3.arc() // define the 2nd acr
                        .innerRadius(0)
                        .outerRadius(graphSettings.height - 4)
                        .startAngle(degrees_to_radians(DataArrays.leastPresentValueLeft))
                        .endAngle(degrees_to_radians(DataArrays.leastPresentValueRight));
        
        var arc3 = d3.arc() // define the 3rd acr
                        .innerRadius(0)
                        .outerRadius(graphSettings.height - 4)
                        .startAngle(degrees_to_radians(DataArrays.leastPresentValueRight))
                        .endAngle(degrees_to_radians(DataArrays.yRotMax));
        
    
        
        
        graphLegend.append("text") // add legend 
          .text(Math.round(DataArrays.yRotMin * 10) / 10)
          .attr("x", 0)
          .attr("y", -graphSettings.height*1.02)
          .attr("transform",  "rotate( "+(DataArrays.yRotMin- 6) +" , 0, 0)");
        
        graphStat.append("path") // add 1st arc on graph
          .attr("d", arc1)
          .attr("fill", "#FFDA43")
          .attr("stroke", "gray")
          .attr("stroke-width", 2);
        
        graphLegend.append("text")
          .text(Math.round(DataArrays.leastPresentValueLeft * 10) / 10)
          .attr("x", 0)
          .attr("y", -graphSettings.height*1.02)
          .attr("transform",  "rotate( "+(DataArrays.leastPresentValueLeft- 6) +" , 0, 0)");
        
        
        
        
        
        graphStat.append("path") // add 2nd arc on graph
          .attr("d", arc2)
          .attr("fill", "#2BCC00")
          .attr("stroke", "gray")
          .attr("stroke-width", 2);
        
        graphLegend.append("text")
          .text(Math.round(DataArrays.leastPresentValueRight * 10) / 10)
          .attr("x", 0)
          .attr("y", -graphSettings.height*1.02)
          .attr("transform",  "rotate( "+(DataArrays.leastPresentValueRight- 6) +" , 0, 0)");
        
        
        
        
        graphStat.append("path") // add 3rd arc on graph
          .attr("d", arc3)
          .attr("fill", "#FFDA43")
          .attr("stroke", "gray")
          .attr("stroke-width", 2);
        
        graphLegend.append("text")
          .text(Math.round(DataArrays.yRotMax * 10) / 10)
          .attr("x", 0)
          .attr("y", -graphSettings.height*1.02)
          .attr("transform",  "rotate( "+(DataArrays.yRotMax - 3) +" , 0, 0)");
          
          
          
          
        
        graphStat.append("line") // add median line
          .attr("id", "median")
          .attr("class", "axis")
          .attr("x1", 0)   
          .attr("y1", -graphSettings.height  )     
          .attr("x2", 0)    
          .attr("y2",  0)
          .attr("transform",  "rotate( "+DataArrays.yRotMedian +" , 0, 0)")
          .style("stroke", "gray")
          .style('stroke-width', '3px')
          .style("stroke-dasharray", ("3,3"))
          .style("fill", "none");
        
        graphLegend.append("text")
          .text(Math.round(DataArrays.yRotMedian * 10) / 10)
          .attr("x", 0)
          .attr("y", -graphSettings.height*1.02)
          .attr("transform",  "rotate( "+(DataArrays.yRotMedian -3) +" , 0, 0)");
        
    }
    
    
    

    
    
    function compareNumbers(a, b) { // function used to sort values
        return a - b;
    }
    
    
    
    
    function dataLoading(data01){ // read CSV files
      

    
        var yRotSort = [];
    
        data.hr.forEach((element,index) => { // read data file
            if(element<180){yRotSort.push(element)}else{yRotSort.push(-(360-element))}
        });
    
        wall.wallSettings.xMax = data.mi[1]["x_extrem"] + (data.mi[1]["x_extrem"]/(data.mi[0]["n_col_row"]))*2;
        wall.wallSettings.xMin = -wall.wallSettings.xMax;
        
        wall.wallSettings.yMax = data.mi[1]["y_extrem"] + (data.mi[1]["y_extrem"]/(data.mi[1]["n_col_row"]))*2;
        wall.wallSettings.yMin = -wall.wallSettings.yMax;
        
        
        yRotSort.sort(compareNumbers); // sort value
        
        DataArrays.yRotMax = yRotSort[parseInt(yRotSort.length-1)]; // get last value
       
        
        DataArrays.yRotMin =  yRotSort[0]; // get first 
        
        DataArrays.yRotMedian = yRotSort[parseInt(yRotSort.length/2)]; // get median value
        DataArrays.leastPresentValueLeft = yRotSort[parseInt(yRotSort.length*DataArrays.leastPresentValuePercentage)];
        DataArrays.leastPresentValueRight = yRotSort[parseInt(yRotSort.length - yRotSort.length*DataArrays.leastPresentValuePercentage)];
        
        
        wall.wallSettings.yScale = d3.scaleLinear() // declare the wall domains
          .domain([(wall.wallSettings.yMax), (wall.wallSettings.yMin)]) 
          .range([(0), (wall.wallSettings.height)]);
        
        wall.wallSettings.xScale = d3.scaleLinear()
          .domain([(wall.wallSettings.xMin), (wall.wallSettings.xMax)]) 
          .range([(0), (wall.wallSettings.width)]);
    
    }
    
    
    
    
    function start(data01,{ // start function
    
            displayMoles = wall.wallSettings.displayMoles,
            
            displayHeadPoint = graphStat.graphSettings.displayHeadPoint,
            displayFieldOfViewState = graphStat.graphSettings.displayFieldOfViewState,
          
        } = {}){
      
      
        wall.wallSettings.displayMoles = displayMoles;
        graphStat.graphSettings.displayHeadPoint = displayHeadPoint;
        graphStat.graphSettings.displayFieldOfViewState = displayFieldOfViewState;
        
        
        dataLoading(data01);
        
        if(displayMoles)wall.addGraphMoles();
        
        if(displayHeadPoint)graphStat.addHeadPoint();
        
        if(displayFieldOfViewState)addFieldOfViewState();
    
    }
    
    


//******************************************************************************
//******************************************************************************