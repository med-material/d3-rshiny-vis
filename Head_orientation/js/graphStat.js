//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-16-2022                             */
/*      graphStat.js                            */
/*      v1_0_0                                  */
//////////////////////////////////////////////////

//Contains all the functions necessary for the operation of the wall display.



var graphStat = {

  graphSettings : {
        height : 265,//px
        width : 550,//px
        
        marginTop : 290,//px
        marginLeft : 125,//px
        
        
        valueMax : 2,
        
        
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
      
      
        displayHeadPoint : false,
        displayFieldOfViewState : false,
        
        
        

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
    
    // Add a point as an head 
    addHeadPoint : function(){ 
        headOrientationStatDiv
            .append('div')
            .attr('id', "headPoint")
            .attr('style', 
                "left:"+((graphStat.graphSettings.width/2)-(graphStat.graphSettings.headSize/2))+"px;"+
                "top:"+((graphStat.graphSettings.height)-(graphStat.graphSettings.headSize/2))+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: "+graphStat.graphSettings.headColor+";"+
                "width:"+(graphStat.graphSettings.headSize)+"px;"+
                "height:"+(graphStat.graphSettings.headSize)+"px;"+
                "border-radius:"+(graphStat.graphSettings.headSize)+"px");
                
    },
    
    addTextOnSvg : function(element,value,x,y,size,color,transform=""){
      element.append("text")
          .text(value)
          .attr("x", x)
          .attr("y", y)
          .attr("font-size", size)
          .attr("font-weight", "bold")
          .attr("fill",color)
          .attr("transform",transform)
    },
    
    degrees_to_radians : function(deg){
      return((deg * Math.PI) / 180.0);
    },
    
    addArcOnSvg : function(element,innerRadius,outerRadius,startAngle,endAngle,lineColor,fillColor,width){
       var arc = d3.arc() 
                      .innerRadius(innerRadius)
                      .outerRadius(outerRadius)
                      .startAngle(graphStat.degrees_to_radians(startAngle))
                      .endAngle(graphStat.degrees_to_radians(endAngle));
                      
        element.append("path") 
          .attr("d", arc)
          .attr("fill", fillColor)
          .attr("stroke", lineColor)
          .attr("stroke-width", width);

    },
    
    addFieldOfViewState : function(){ 
      
        // To make the program more readable
        var graphSett = graphStat.graphSettings;
        
        
        
        // Add SVG section on the graph (to add D3 point inside)
        var graphStatSvg =  headOrientationStatDiv 
                      .append("svg")
                      .attr('id', "addFieldOfViewState")
                      .attr("width", graphSett.width)
                      .attr("height", graphSett.height)
                      .append("g")
                      .attr("transform", "translate(" + graphSett.width / 2 + "," + graphSett.height+ ")");
                      
        // Add SVG section on the graph (to add D3 point inside)              
        var graphLegendSvg =  headOrientationStatDiv 
                      .append("svg")
                      .attr('id', "addFieldOfViewStateLegend")
                      .attr("width", graphSett.width)
                      .attr("height", (graphSett.height +50))
                      .attr("style", "position:absolute;margin-left:"+(-graphSett.width)+"px;margin-top:"+(-50)+"px")
                      .append("g")
                      .attr("transform", "translate(" + graphSett.width / 2 + "," + (graphSett.height + 50)+ ")");
                      
        // Add SVG section on the graph (to add D3 point inside)             
        var bottomTextSvg =  headOrientationStatDiv 
                      .append("svg")
                      .attr('id', "bottomTextSvg")
                      .attr("width", graphSett.width)
                      .attr("height", (100))
                      .append("g")

                      
                      
        
        
    

        // Add back arc on graph
        graphStat.addArcOnSvg(graphStatSvg,0,(graphSett.height - 3),(-90),(90),graphSett.circleLineColor,"#FFFFFF",4);
        
        // Add "LOOKED LEFT" text on bottom of the graph
        graphStat.addTextOnSvg(bottomTextSvg,"LOOKED LEFT",10,30,graphSett.legendBottomTextSize,graphSett.legendBottomTextColor);
    
        // Add "LOOKED RIGHT" text on bottom of the graph
        graphStat.addTextOnSvg(bottomTextSvg,"LOOKED RIGHT",(graphSett.width-210),30,graphSett.legendBottomTextSize,graphSett.legendBottomTextColor);

      
      
        // Add min rotation value to the graph 
        graphStat.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.yRotMin * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.yRotMin- 6) +" , 0, 0)"));
  


        // Add the least present value arc on the left to the graph
        graphStat.addArcOnSvg(graphStatSvg,0,(graphSett.height - 4),(graphSett.yRotMin),(graphSett.leastPresentValueLeft),graphSett.circleLineColor,graphSett.yellowColor,2);
        
        // Add the least present value text on the left to the graph
        graphStat.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.leastPresentValueLeft * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.leastPresentValueLeft- 6) +" , 0, 0)"));
        

        // Add 2nd arc on graph
        graphStat.addArcOnSvg(graphStatSvg,0,(graphSett.height - 4),(graphSett.leastPresentValueLeft),(graphSett.leastPresentValueRight),graphSett.circleLineColor,graphSett.greenColor,2);
        
        // Add 2rd arc text on graph
        graphStat.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.leastPresentValueRight * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.leastPresentValueRight- 6) +" , 0, 0)"));
        
        
        // Add the least present value arc on the Right to the graph
        graphStat.addArcOnSvg(graphStatSvg,0,(graphSett.height - 4),(graphSett.leastPresentValueRight),(graphSett.yRotMax),graphSett.circleLineColor,graphSett.yellowColor,2);

        // Add the least present value text on the Right to the graph
        graphStat.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.yRotMax * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.yRotMax - 3) +" , 0, 0)"));
          
          
          
        // Add median value line
        graphStatSvg.append("line") 
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
        graphStat.addTextOnSvg(graphLegendSvg,(Math.round(graphSett.yRotMedian * 10) / 10),0,(-graphSett.height*1.02),graphSett.legendTopTextSize,graphSett.legendTopTextColor,("rotate( "+(graphSett.yRotMedian - 3) +" , 0, 0)"));
    }
    
   
}