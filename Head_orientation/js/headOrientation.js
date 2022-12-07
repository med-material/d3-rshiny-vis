//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-07-2022                             */
/*      headOrientation.js                      */
/*      v1_0_1                                  */
//////////////////////////////////////////////////

//Contains all the functions necessary for the operation of the graph display.


var headOrientation = {

    settings : {
        height : 0,//px
        width : 0,//px
        
        marginTop : 0,//px
        marginLeft : 0,//px
        
        headSize : 0,//px
        headColor : "",
        
        legendTopTextSize : 0,
        legendTopTextColor : "",
        
        legendBottomTextSize : 0,
        legendBottomTextColor : "",
        
        circleLineColor : "",
        medianLineColor : "",
        
        greenColor : "",
        yellowColor : "",
    },
    
    element : {
        headOrientationSection : {},
    },
    
    leastPresentValuePercentage : 0.12, // % of the least representative values
     
    leastPresentValueLeft : 0, // value at which "leastPresentValuePercentage"% of all values are less than it
    leastPresentValueRight : 0, // value at which "1-leastPresentValuePercentage"% of all values are greater than it
    
    yRotMedian : 0, // median of the rotation value
    yRotMin : 0, // value min
    yRotMax : 0, // value max
      
      
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){
      
        headOrientation.settings = newSettings;
  
        
        // Retrieval of the largest value of the rotation values
        headOrientation.yRotMax = data.hearCamRotSort[parseInt(data.hearCamRotSort.length-1)];
       
        // Retrieval of the smallest value of the rotation values
        headOrientation.yRotMin =  data.hearCamRotSort[0]; 
        
        // Get median value
        headOrientation.yRotMedian = data.hearCamRotSort[parseInt(data.hearCamRotSort.length/2)];
        
        // Get least present value left
        headOrientation.leastPresentValueLeft = data.hearCamRotSort[parseInt(data.hearCamRotSort.length*headOrientation.leastPresentValuePercentage)];
        
        // Get least present value right
        headOrientation.leastPresentValueRight = data.hearCamRotSort[parseInt(data.hearCamRotSort.length - data.hearCamRotSort.length*headOrientation.leastPresentValuePercentage)];
    },
    
    // Create an section for graph 
    createHeadOrientationSection : function(back){
         
        headOrientation.element.headOrientationSection = back.append('div') 
                  .attr('style', 
                      "width:" +headOrientation.settings.width+"px;"+
                      "height:" +(headOrientation.settings.height)+"px;"+
                      "position:absolute;"+
                      "margin-left:"+(headOrientation.settings.marginLeft)+"px;"+
                      "margin-top:"+headOrientation.settings.marginTop+"px;"+
                      "background: rgb(50, 50, 50, 0)"
                  );
    },
    
    // Add a point as an head 
    addHeadPoint : function(){ 
      
        headOrientation.element.headOrientationSection
            .append('div')
            .attr('id', "headPoint")
            .attr('style', 
                "left:"+((headOrientation.settings.width/2)-(headOrientation.settings.headSize/2))+"px;"+
                "top:"+((headOrientation.settings.height)-(headOrientation.settings.headSize/2))+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: "+headOrientation.settings.headColor+";"+
                "width:"+(headOrientation.settings.headSize)+"px;"+
                "height:"+(headOrientation.settings.headSize)+"px;"+
                "border-radius:"+(headOrientation.settings.headSize)+"px");
    },
    
    addTextOnSvg : function(element,value,x,y,size,color,transform=""){
      
        element.append("text")
            .text(value)
            .attr("x", x)
            .attr("y", y)
            .attr("font-size", size)
            .attr("font-weight", "bold")
            .attr("fill",color)
            .attr("transform",transform);
    },
    
    degrees_to_radians : function(deg){
      
        return((deg * Math.PI) / 180.0);
    },
    
    addArcOnSvg : function(element,innerRadius,outerRadius,startAngle,endAngle,lineColor,fillColor,width){
      
         var arc = d3.arc() 
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius)
                        .startAngle(headOrientation.degrees_to_radians(startAngle))
                        .endAngle(headOrientation.degrees_to_radians(endAngle));
                        
          element.append("path") 
            .attr("d", arc)
            .attr("fill", fillColor)
            .attr("stroke", lineColor)
            .attr("stroke-width", width);
    },
    
    addHeadOrientationGraph : function(){ 
      
        // To make the program more readable
        var graphSett = headOrientation.settings;
        
        
        // Add SVG section on the graph (to add D3 point inside)
        var headOrientationSvg =  headOrientation.element.headOrientationSection 
                      .append("svg")
                      .attr('id', "addHeadOrientationGraph")
                      .attr("width", graphSett.width)
                      .attr("height", graphSett.height)
                      .append("g")
                      .attr("transform", "translate(" + graphSett.width / 2 + "," + graphSett.height+ ")");
                      
        // Add SVG section on the graph (to add D3 point inside)              
        var graphLegendSvg =  headOrientation.element.headOrientationSection 
                      .append("svg")
                      .attr('id', "addHeadOrientationGraphLegend")
                      .attr("width", graphSett.width)
                      .attr("height", (graphSett.height +50))
                      .attr("style", "position:absolute;margin-left:"+(-graphSett.width)+"px;margin-top:"+(-50)+"px")
                      .append("g")
                      .attr("transform", "translate(" + graphSett.width / 2 + "," + (graphSett.height + 50)+ ")");
                      
        // Add SVG section on the graph (to add D3 point inside)             
        var bottomTextSvg =  headOrientation.element.headOrientationSection 
                      .append("svg")
                      .attr('id', "bottomTextSvg")
                      .attr("width", graphSett.width)
                      .attr("height", (100))
                      .append("g");


        // Add back arc on graph
        headOrientation.addArcOnSvg(headOrientationSvg,0,(graphSett.height - 3),(-90),(90),graphSett.circleLineColor,"#FFFFFF",4);
        
        // Add "LOOKED LEFT" text on bottom of the graph
        headOrientation.addTextOnSvg(bottomTextSvg,"LOOKED LEFT",10,30,graphSett.legendBottomTextSize,graphSett.legendBottomTextColor);
    
        // Add "LOOKED RIGHT" text on bottom of the graph
        headOrientation.addTextOnSvg(bottomTextSvg,"LOOKED RIGHT",(graphSett.width-210),30,graphSett.legendBottomTextSize,graphSett.legendBottomTextColor);

      
      
        // Add min rotation value to the graph 
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(headOrientation.yRotMin * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,headOrientation.legendTopTextColor,("rotate( "+(headOrientation.yRotMin- 6) +" , 0, 0)"));
  


        // Add the least present value arc on the left to the graph
        headOrientation.addArcOnSvg(headOrientationSvg,0,(graphSett.height - 4),(headOrientation.yRotMin),(headOrientation.leastPresentValueLeft),graphSett.circleLineColor,graphSett.yellowColor,2);
        
        // Add the least present value text on the left to the graph
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(headOrientation.leastPresentValueLeft * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(headOrientation.leastPresentValueLeft- 6) +" , 0, 0)"));
        

        // Add 2nd arc on graph
        headOrientation.addArcOnSvg(headOrientationSvg,0,(graphSett.height - 4),(headOrientation.leastPresentValueLeft),(headOrientation.leastPresentValueRight),graphSett.circleLineColor,graphSett.greenColor,2);
        
        // Add 2rd arc text on graph
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(headOrientation.leastPresentValueRight * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,headOrientation.legendTopTextColor,("rotate( "+(headOrientation.leastPresentValueRight- 6) +" , 0, 0)"));
        
        
        // Add the least present value arc on the Right to the graph
        headOrientation.addArcOnSvg(headOrientationSvg,0,(graphSett.height - 4),(headOrientation.leastPresentValueRight),(headOrientation.yRotMax),graphSett.circleLineColor,graphSett.yellowColor,2);

        // Add the least present value text on the Right to the graph
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(headOrientation.yRotMax * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(headOrientation.yRotMax - 3) +" , 0, 0)"));
          
          
          
        // Add median value line
        headOrientationSvg.append("line") 
          .attr("id", "median")
          .attr("class", "axis")
          .attr("x1", 0)   
          .attr("y1", -graphSett.height  )     
          .attr("x2", 0)    
          .attr("y2",  0)
          .attr("transform",  "rotate( "+headOrientation.yRotMedian +" , 0, 0)")
          .style("stroke", graphSett.medianLineColor)
          .style('stroke-width', '3px')
          .style("stroke-dasharray", ("3,3"))
          .style("fill", "none");
        
        // Add median value text
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(headOrientation.yRotMedian * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(headOrientation.yRotMedian - 3) +" , 0, 0)"));
        
        
        headOrientation.element.headOrientationSection
            .append('div')
            .attr('id', "headPoint")
            .attr('style', 
                "left:"+((headOrientation.settings.width/2)-(headOrientation.settings.headSize/2))+"px;"+
                "top:"+((headOrientation.settings.height)-(headOrientation.settings.headSize/2))+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: "+headOrientation.settings.headColor+";"+
                "width:"+(headOrientation.settings.headSize)+"px;"+
                "height:"+(headOrientation.settings.headSize)+"px;"+
                "border-radius:"+(headOrientation.settings.headSize)+"px");
    },
    
};


//******************************************************************************
//******************************************************************************