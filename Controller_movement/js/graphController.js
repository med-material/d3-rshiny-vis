//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-07-2022                             */
/*      GraphController.js                      */
/*      v1_1_1                                  */
//////////////////////////////////////////////////
//Contains all the functions necessary for the operation of the graph display.


var graphController = {
  
  settings : {
        height : 0,//px
        width : 0,//px
        
        marginTop : 0,//px
        marginLeft : 0,//px

        valueMax : 0,
        zoom : 0,

        pointSize : 0,//px
        pointColor : "#0055FF11", 
        
        controllerPicURL : "img/controller.png",
        controllerHeight : 0,//px
        controllerWidth : 0,//px
    },
    
    scale : {
        yScale : {}, // value to pixel for the y conversion obj
        xScale : {}, // value to pixel for the x conversion obj
    },
    
    element : {
        graphControllerDiv : {},
        graphControllerSvg : {},
        objController : {},
    },
    
    indexController : 0,
    
    
    
    
  
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){
      
        graphController.settings = newSettings;
        
        // Declaration of the graph domains
        graphController.scale.yScale = d3.scaleLinear()
            .domain([(graphController.settings.valueMax/graphController.settings.zoom), (-graphController.settings.valueMax/graphController.settings.zoom)]) 
            .range([(0), (graphController.settings.height)]);
        		
        graphController.scale.xScale = d3.scaleLinear()
            .domain([(-graphController.settings.valueMax/graphController.settings.zoom), (graphController.settings.valueMax/graphController.settings.zoom)]) 
            .range([(0), (graphController.settings.width)]);
       
    },
    
    createSection : function(back){
      
        graphController.element.graphControllerDiv = utils.addElement("div",back,
              [
                "width:" +graphController.settings.width+"px;"+
                "height:" +graphController.settings.height+"px;"+
                "position:absolute;"+
                "margin-left:"+(graphController.settings.marginLeft)+"px;"+
                "margin-top:"+graphController.settings.marginTop+"px;"
              ]
        );
  
         // Create an SVG for graph
         graphController.element.graphControllerSvg = utils.addElement("svg",graphController.element.graphControllerDiv,
              [
                "width:"+graphController.settings.width+"px;"+
                "height:"+graphController.settings.height+"px;"+
                "position:absolute;"
              ]
         );   
    },
    
    addController : function(){
      
        // Create a DIV with a background controller image
        graphController.element.objController = utils.addElement("div",graphController.element.graphControllerDiv,
            [
                "left:"+200+"px;"+
                "top:"+200+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 00);"+
                "width:"+(graphController.settings.controllerWidth)+"px;"+
                "height:"+(graphController.settings.controllerHeight)+"px;"+
                "justify-content: center;"+
                "align-items: flex-top;"+
                "background-image: url("+graphController.settings.controllerPicURL+");"+
                "background-repeat: no-repeat;"+
                "background-position: center;"+
                "background-size: 100% 100%;"
            ]
        );
    
    },
    
    addControllerPath : function(){
        
        // Add controller path on graph
        graphController.element.graphControllerSvg
            .selectAll("dot")
            .data(data.ad)
            .enter()
            .append("circle")
            .attr("cx", (d,i) => graphController.getControllerCoordPx(i)[0] )
            .attr("cy", (d,i) => graphController.getControllerCoordPx(i)[1] )
            .attr("r", graphController.settings.pointSize)
            .style("fill", graphController.settings.pointColor);
        
    },
    
    // Convert controller's coordinates to pixel values
    getControllerCoordPx : function(i){
        coord = [0,0,0];
        if(data.ad[i]['RightControllerPosWorldX'] != "NULL")coord[0] = graphController.scale.xScale((data.ad[i]['RightControllerPosWorldX']-data.ad[i]['HeadCameraPosWorldX'])*graphController.settings.zoom);
        if(data.ad[i]['RightControllerPosWorldZ'] != "NULL")coord[1] = graphController.scale.yScale((data.ad[i]['RightControllerPosWorldZ']-data.ad[i]['HeadCameraPosWorldZ'])*graphController.settings.zoom);
        if(data.ad[i]['RightControllerRotEulerY'] != "NULL")coord[2] = data.ad[i]['RightControllerRotEulerY'];
        
        return coord;
    },
    
    changeControllerLocation : function(){
      
        // If the target date is less than the date in the index of events
        if(new Date(ChartOptions.indexDate) >= new Date(data.ad[graphController.indexController]['Timestamp'])){
            while(new Date(ChartOptions.indexDate) >=new Date(data.ad[graphController.indexController]['Timestamp'])){
            
                graphController.element.objController.transition()
                .duration(14).attr('style', 
                    "left:"+(graphController.getControllerCoordPx(graphController.indexController)[0])+"px;"+
                    "top:"+(graphController.getControllerCoordPx(graphController.indexController)[1])+"px;"+
                    "display: flex;"+
                    "position:absolute;"+
                    "background: rgb(50, 50, 50, 00);"+
                    "width:"+(graphController.settings.controllerWidth)+"px;"+
                    "height:"+(graphController.settings.controllerHeight)+"px;"+
                    "justify-content: center;"+
                    "align-items: flex-top;"+
                    "background-image: url("+graphController.settings.controllerPicURL+");"+
                    "background-repeat: no-repeat;"+
                    "background-position: center;"+
                    "background-size: 100% 100%;"+
                    "transform: rotate("+(graphController.getControllerCoordPx(graphController.indexController)[2])+"deg)"
                );
                
                graphController.indexController++
            
            }
        }
    },
    
    addHeadPoint : function(){
        
        // Add point as a head
        utils.addElement("div",graphController.element.graphControllerDiv,
            [
                "left:"+((graphController.settings.width/2)-((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))/2)+"px;"+
                "top:"+((graphController.settings.height/2)-((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))/2)+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 1);"+
                "width:"+((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))+"px;"+
                "height:"+((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))+"px;"+
                "border-radius:"+(((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))/2)+"px"
            ]
        );
    },
    
    addAxis : function(){
      
        newAxis = function(id,x1,x2,y1,y2){
            graphController.element.graphControllerSvg.append("line")
                .attr("id", id)
                .attr("class", "axis")
                .attr("x1", x1)   
                .attr("y1", y1 )     
                .attr("x2", x2)    
                .attr("y2", y2 )
                .style("stroke", "#b3b3b3")
                .style('stroke-width', '2px')
                .style("stroke-dasharray", ("8,8"))
                .style("fill", "none");
        };
    
        // Add x axis
        newAxis("abscisseAxis",0,graphController.settings.width,(graphController.settings.height/2),(graphController.settings.height/2));
        
        // Add y axis
        newAxis("ordinateAxis",(graphController.settings.width/2),(graphController.settings.width/2),(0),(graphController.settings.height));

        
        
        // Add vertical axis
        newAxis("RightAxis",(graphController.scale.xScale(1)),(graphController.scale.xScale(1)),(0),(graphController.settings.height));
        
        newAxis("LeftAxis",(graphController.scale.xScale(-1)),(graphController.scale.xScale(-1)),(0),(graphController.settings.height));

        
        
        // Add horizontal axis
        newAxis("topAxis",(0),(graphController.settings.width),graphController.scale.yScale(1),(graphController.scale.yScale(1)));
        
        newAxis("bottomAxis",(0),(graphController.settings.width),(graphController.scale.yScale(-1)),(graphController.scale.yScale(-1)));

        
    },
    
    addGraphBorder : function(){
        newGraphBorder = function(id,x1,x2,y1,y2){
              graphController.element.graphControllerSvg.append("line")
                  .attr("id", id)
                  .attr("class", "axis")
                  .attr("x1", x1)   
                  .attr("y1", y1 )     
                  .attr("x2", x2)    
                  .attr("y2", y2 )
                  .style("stroke", "#b3b3b3")
                  .style('stroke-width', '4px')
                  .style("fill", "none");
          };
          
          newGraphBorder("bottomBorder",0,graphController.settings.width,(graphController.settings.height-2),(graphController.settings.height-2));
          newGraphBorder("topBorder",0,graphController.settings.width,(0+2),(0+2));
          
          
          newGraphBorder("leftBorder",(0+2),(0+2),(0),(graphController.settings.height));
          
          newGraphBorder("rightBorder",(graphController.settings.width-2),(graphController.settings.width-2),(0),(graphController.settings.height));
    },
}