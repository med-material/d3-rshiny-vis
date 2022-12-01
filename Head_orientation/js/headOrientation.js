//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-01-2022                             */
/*      headOrientation.js                      */
/*      v1_0_0                                  */
//////////////////////////////////////////////////

//Contains all the functions necessary for the operation of the wall display.


var headOrientation = {

    settings : {
        headOrientationSection : {},
        
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
        
        
        valueMax : 2,

        
        leastPresentValuePercentage : 0.12, // % of the least representative values
        
        leastPresentValueLeft : 0, // value at which "leastPresentValuePercentage"% of all values are less than it
        leastPresentValueRight : 0, // value at which "1-leastPresentValuePercentage"% of all values are greater than it
        
        yRotMedian : 0, // median of the rotation value
        yRotMin : 0, // value min
        yRotMax : 0, // value max
    
    },
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){
      
        headOrientation.settings.height = newSettings.height;
        headOrientation.settings.width = newSettings.width;
        
        headOrientation.settings.marginTop = newSettings.marginTop;
        headOrientation.settings.marginLeft = newSettings.marginLeft;
        
        headOrientation.settings.headSize = newSettings.headSize;
        headOrientation.settings.headColor = newSettings.headColor;
        
        headOrientation.settings.legendTopTextSize = newSettings.legendTopTextSize;
        headOrientation.settings.legendTopTextColor = newSettings.legendTopTextColor;
        
        headOrientation.settings.legendBottomTextSize = newSettings.legendBottomTextSize;
        headOrientation.settings.legendBottomTextColor = newSettings.legendBottomTextColor;
        
        headOrientation.settings.circleLineColor = newSettings.circleLineColor;
        headOrientation.settings.medianLineColor = newSettings.medianLineColor;
        
        headOrientation.settings.greenColor = newSettings.greenColor;
        headOrientation.settings.yellowColor = newSettings.yellowColor;
        
        
        
        // Retrieval of the largest value of the rotation values
        headOrientation.settings.yRotMax = data.hearCamRotSort[parseInt(data.hearCamRotSort.length-1)];
       
        // Retrieval of the smallest value of the rotation values
        headOrientation.settings.yRotMin =  data.hearCamRotSort[0]; 
        
        // Get median value
        headOrientation.settings.yRotMedian = data.hearCamRotSort[parseInt(data.hearCamRotSort.length/2)];
        
        // Get least present value left
        headOrientation.settings.leastPresentValueLeft = data.hearCamRotSort[parseInt(data.hearCamRotSort.length*headOrientation.settings.leastPresentValuePercentage)];
        
        // Get least present value right
        headOrientation.settings.leastPresentValueRight = data.hearCamRotSort[parseInt(data.hearCamRotSort.length - data.hearCamRotSort.length*headOrientation.settings.leastPresentValuePercentage)];
    },
    
    // Create an section for graph 
    createHeadOrientationSection : function(back){
         
        headOrientation.settings.headOrientationSection = back.append('div') 
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
      
        headOrientation.settings.headOrientationSection
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
        var headOrientationSvg =  headOrientation.settings.headOrientationSection 
                      .append("svg")
                      .attr('id', "addHeadOrientationGraph")
                      .attr("width", graphSett.width)
                      .attr("height", graphSett.height)
                      .append("g")
                      .attr("transform", "translate(" + graphSett.width / 2 + "," + graphSett.height+ ")");
                      
        // Add SVG section on the graph (to add D3 point inside)              
        var graphLegendSvg =  headOrientation.settings.headOrientationSection 
                      .append("svg")
                      .attr('id', "addHeadOrientationGraphLegend")
                      .attr("width", graphSett.width)
                      .attr("height", (graphSett.height +50))
                      .attr("style", "position:absolute;margin-left:"+(-graphSett.width)+"px;margin-top:"+(-50)+"px")
                      .append("g")
                      .attr("transform", "translate(" + graphSett.width / 2 + "," + (graphSett.height + 50)+ ")");
                      
        // Add SVG section on the graph (to add D3 point inside)             
        var bottomTextSvg =  headOrientation.settings.headOrientationSection 
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
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.yRotMin * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.yRotMin- 6) +" , 0, 0)"));
  


        // Add the least present value arc on the left to the graph
        headOrientation.addArcOnSvg(headOrientationSvg,0,(graphSett.height - 4),(graphSett.yRotMin),(graphSett.leastPresentValueLeft),graphSett.circleLineColor,graphSett.yellowColor,2);
        
        // Add the least present value text on the left to the graph
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.leastPresentValueLeft * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.leastPresentValueLeft- 6) +" , 0, 0)"));
        

        // Add 2nd arc on graph
        headOrientation.addArcOnSvg(headOrientationSvg,0,(graphSett.height - 4),(graphSett.leastPresentValueLeft),(graphSett.leastPresentValueRight),graphSett.circleLineColor,graphSett.greenColor,2);
        
        // Add 2rd arc text on graph
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.leastPresentValueRight * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.leastPresentValueRight- 6) +" , 0, 0)"));
        
        
        // Add the least present value arc on the Right to the graph
        headOrientation.addArcOnSvg(headOrientationSvg,0,(graphSett.height - 4),(graphSett.leastPresentValueRight),(graphSett.yRotMax),graphSett.circleLineColor,graphSett.yellowColor,2);

        // Add the least present value text on the Right to the graph
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.yRotMax * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.yRotMax - 3) +" , 0, 0)"));
          
          
          
        // Add median value line
        headOrientationSvg.append("line") 
          .attr("id", "median")
          .attr("class", "axis")
          .attr("x1", 0)   
          .attr("y1", -graphSett.height  )     
          .attr("x2", 0)    
          .attr("y2",  0)
          .attr("transform",  "rotate( "+graphSett.yRotMedian +" , 0, 0)")
          .style("stroke", graphSett.medianLineColor)
          .style('stroke-width', '3px')
          .style("stroke-dasharray", ("3,3"))
          .style("fill", "none");
        
        // Add median value text
        headOrientation.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.yRotMedian * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.yRotMedian - 3) +" , 0, 0)"));
        
        
        headOrientation.settings.headOrientationSection
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