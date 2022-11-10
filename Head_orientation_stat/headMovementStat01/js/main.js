//////////////////////////////////////////////////
/*      Graph D3.js headOrientationStat01       */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-04-2022                             */
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
        
        displayMoles : false,
      
    }

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
    
    
    var back = d3.select("body") // create a D3 section
                    .append("div")
                    .attr('style', 
                        "width:"+windowSettings.width+
                        "px;height:"+windowSettings.height+
                        "px;background-image: url("+windowSettings.backgroundPicURL+");"+
                        "background-repeat: no-repeat;"+
                        "background-position: center;"+
                        "background-size: 100% 100%;"+
                        "position: relative"
                    );
      
      
    svg = back.append('svg') // create a SVG section for the moles wall
              .attr("width", wallSettings.width)
              .attr("height", wallSettings.height)
              .attr('style', 
                  "position:absolute;"+
                  "margin-left:"+(wallSettings.marginLeft)+"px;"+
                  "margin-top:"+wallSettings.marginTop+"px"
              );
      
      
    div = back.append('div') // create an section for graph
              .attr('style', 
                  "width:" +graphSettings.width+"px;"+
                  "height:" +(graphSettings.height)+"px;"+
                  "position:absolute;"+
                  "margin-left:"+(graphSettings.marginLeft)+"px;"+
                  "margin-top:"+graphSettings.marginTop+"px;"+
                  "background: rgb(50, 50, 50, 0)"
              );
    
    
    var graphWall = svg.append("g"); 
        
    var graphController = div;

  
  
    
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




    
    
    function addGraphMoles() { // add all moles on the wall
    
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
    
    
    
    
    
    
    
    
    
    
    
    
    function addHeadPoint(){ // add a point as an head 
      
         graphController
            .append('div')
            .attr('id', "headPoint")
            .attr('style', 
                "left:"+((graphSettings.width/2)-(graphSettings.headSize/2))+"px;"+
                "top:"+((graphSettings.height)-(graphSettings.headSize/2))+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: "+graphSettings.headColor+";"+
                "width:"+(graphSettings.headSize)+"px;"+
                "height:"+(graphSettings.headSize)+"px;"+
                "border-radius:"+(graphSettings.headSize)+"px");
    }
    
    
    
    
    
    
    
    function addFieldOfViewState(){ // add Field Of View State on the graph
        
        const degrees_to_radians = deg => (deg * Math.PI) / 180.0;
        
        var graphStat =  graphController // add SVG section on the graph (to add D3 point inside)
                      .append("svg")
                      .attr('id', "addFieldOfViewState")
                      .attr("width", graphSettings.width)
                      .attr("height", graphSettings.height)
                      .append("g")
                      .attr("transform", "translate(" + graphSettings.width / 2 + "," + graphSettings.height+ ")");
                      
        var graphLegend =  graphController // add SVG section on the graph (to add D3 point inside)
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
    
    
    
    
    function getMolesCoordPx(i){ // calculate moles position
        var coord = [0,0];
        
        coord[0] = wallSettings.xScale(DataArrays.xMoles[i]);
        coord[1] = wallSettings.yScale(DataArrays.yMoles[i]);
        
        return coord;
    }
    
    
    
    
    function compareNumbers(a, b) { // function used to sort values
        return a - b;
    }
    
    
    
    
    function dataLoading(data01){ // read CSV files
      
        data.am.forEach(element => { // read moles position file
            DataArrays.idMoles.push(element.id);
            DataArrays.xMoles.push(element.x);
            DataArrays.yMoles.push(element.y);
        });
    
    
        data.ad.forEach((element,index) => { // read data file
        
        
            if(element.HeadCameraRotEulerY != "NULL"){
                DataArrays.yHeadRot.push(element.HeadCameraRotEulerY);
            }else{
                DataArrays.yHeadRot.push(DataArrays.yHeadRot[index-1]);
            }
            
        });
    
        ////////////////////
    
        var yRotSort = [];
    
        DataArrays.yHeadRot.forEach((element,index) => { // convert all values to positive
            if(element<180){yRotSort.push(element)}else{yRotSort.push(-(360-element))}
        });
        
        
        yRotSort.sort(compareNumbers); // sort value
        
        DataArrays.yRotMax = yRotSort[parseInt(yRotSort.length-1)]; // get last value
        DataArrays.yRotMin =  yRotSort[0]; // get first 
        
        DataArrays.yRotMedian = yRotSort[parseInt(yRotSort.length/2)]; // get median value
        DataArrays.leastPresentValueLeft = yRotSort[parseInt(yRotSort.length*DataArrays.leastPresentValuePercentage)];
        DataArrays.leastPresentValueRight = yRotSort[parseInt(yRotSort.length - yRotSort.length*DataArrays.leastPresentValuePercentage)];
        
        
        wallSettings.yScale = d3.scaleLinear() // declare the wall domains
          .domain([(wallSettings.yMax), (wallSettings.yMin)]) 
          .range([(0), (wallSettings.height)]);
        
        wallSettings.xScale = d3.scaleLinear()
          .domain([(wallSettings.xMin), (wallSettings.xMax)]) 
          .range([(0), (wallSettings.width)]);
    
    }
    
    
    
    
    function start(data01,{ // start function
    
            displayMoles = wallSettings.displayMoles,
            
            displayHeadPoint = graphSettings.displayHeadPoint,
            displayFieldOfViewState = graphSettings.displayFieldOfViewState,
          
        } = {}){
      
      
        wallSettings.displayMoles = displayMoles;
        graphSettings.displayHeadPoint = displayHeadPoint;
        graphSettings.displayFieldOfViewState = displayFieldOfViewState;
        
        
        dataLoading(data01);
        
        if(displayMoles)addGraphMoles();
        
        if(displayHeadPoint)addHeadPoint();
        
        if(displayFieldOfViewState)addFieldOfViewState();
    
    }
    
    


//******************************************************************************
//******************************************************************************