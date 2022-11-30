//////////////////////////////////////////////////
/*                                              */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-22-2022                             */
/*      controller.js                           */
/*      v1_0_0                                  */
//////////////////////////////////////////////////

//Contains all the functions necessary for the operation of the wall display.




var graphController = {
  
  graphSettings : {
        height : 446,//px
        width : 446,//px
        
        marginTop : 273,//px
        marginLeft : 175,//px
        
        yScale : {}, // value to pixel for the y conversion obj
        xScale : {}, // value to pixel for the x conversion obj
        
        
        valueMax : 2,
        zoom : 1.6,
        
        pointSize : 2,//px
        pointColor : "#0055FF11", 
        
        
        controllerPicURL : "img/controller.png",
        controllerHeight : 40,//px
        controllerWidth : 40,//px
    
    },
  
    test : function(){
        return 1;
    },
    
    addController : function(){
      
        // Create a DIV with a background controller image
        DataArrays.objController = utils.addElement("div",graphControllerDiv,
            [
                "left:"+200+"px;"+
                "top:"+200+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 00);"+
                "width:"+(graphController.graphSettings.controllerWidth)+"px;"+
                "height:"+(graphController.graphSettings.controllerHeight)+"px;"+
                "justify-content: center;"+
                "align-items: flex-top;"+
                "background-image: url("+graphController.graphSettings.controllerPicURL+");"+
                "background-repeat: no-repeat;"+
                "background-position: center;"+
                "background-size: 100% 100%;"
            ]
        );
    
    },
    
    addControllerPath : function(){
        
        // Add controller path on graph
        graphControllerSvg
            .selectAll("dot")
            .data(data.ad)
            .enter()
            .append("circle")
            .attr("cx", (d,i) => graphController.getControllerCoordPx(i)[0] )
            .attr("cy", (d,i) => graphController.getControllerCoordPx(i)[1] )
            .attr("r", graphController.graphSettings.pointSize)
            .style("fill", graphController.graphSettings.pointColor);
        
    },
    
    // Convert controller's coordinates to pixel values
    getControllerCoordPx : function(i){
        coord = [0,0,0];
        
        if(data.ad[i]['RightControllerPosWorldX'] != "NULL")coord[0] = graphController.graphSettings.xScale((data.ad[i]['RightControllerPosWorldX']-data.ad[i]['HeadCameraPosWorldX'])*graphController.graphSettings.zoom);
        if(data.ad[i]['RightControllerPosWorldZ'] != "NULL")coord[1] = graphController.graphSettings.yScale((data.ad[i]['RightControllerPosWorldZ']-data.ad[i]['HeadCameraPosWorldZ'])*graphController.graphSettings.zoom);
        if(data.ad[i]['RightControllerRotEulerY'] != "NULL")coord[2] = data.ad[i]['RightControllerRotEulerY'];
        
        return coord;
    },
    
    changeControllerLocation : function(){
      
        // If the target date is less than the date in the index of events
        if(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexController]['Timestamp'])){
            while(new Date(DataArrays.indexDate) >=new Date(data.ad[DataArrays.indexController]['Timestamp'])){
            
                DataArrays.objController.transition()
                .duration(14).attr('style', 
                    "left:"+(graphController.getControllerCoordPx(DataArrays.indexController)[0])+"px;"+
                    "top:"+(graphController.getControllerCoordPx(DataArrays.indexController)[1])+"px;"+
                    "display: flex;"+
                    "position:absolute;"+
                    "background: rgb(50, 50, 50, 00);"+
                    "width:"+(graphController.graphSettings.controllerWidth)+"px;"+
                    "height:"+(graphController.graphSettings.controllerHeight)+"px;"+
                    "justify-content: center;"+
                    "align-items: flex-top;"+
                    "background-image: url("+graphController.graphSettings.controllerPicURL+");"+
                    "background-repeat: no-repeat;"+
                    "background-position: center;"+
                    "background-size: 100% 100%;"+
                    "transform: rotate("+(graphController.getControllerCoordPx(DataArrays.indexController)[2])+"deg)"
                );
                
                DataArrays.indexController++
            
            }
        }
    },
    
    addHeadPoint : function(){
        
        // Add point as a head
        utils.addElement("div",graphControllerDiv,
            [
                "left:"+((graphController.graphSettings.width/2)-((0.2*graphController.graphSettings.width)/((graphController.graphSettings.valueMax/graphController.graphSettings.zoom)*2))/2)+"px;"+
                "top:"+((graphController.graphSettings.height/2)-((0.2*graphController.graphSettings.width)/((graphController.graphSettings.valueMax/graphController.graphSettings.zoom)*2))/2)+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 1);"+
                "width:"+((0.2*graphController.graphSettings.width)/((graphController.graphSettings.valueMax/graphController.graphSettings.zoom)*2))+"px;"+
                "height:"+((0.2*graphController.graphSettings.width)/((graphController.graphSettings.valueMax/graphController.graphSettings.zoom)*2))+"px;"+
                "border-radius:"+(((0.2*graphController.graphSettings.width)/((graphController.graphSettings.valueMax/graphController.graphSettings.zoom)*2))/2)+"px"
            ]
        );
    },
    
    addAxis : function(){
      
      newAxis = function(id,x1,x2,y1,y2){
        graphControllerSvg.append("line")
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
      }
    
        // Add x axis
        newAxis("abscisseAxis",0,graphController.graphSettings.width,(graphController.graphSettings.height/2),(graphController.graphSettings.height/2));
        
        // Add y axis
        newAxis("ordinateAxis",(graphController.graphSettings.width/2),(graphController.graphSettings.width/2),(0),(graphController.graphSettings.height));

        
        
        // Add vertical axis
        newAxis("RightAxis",(graphController.graphSettings.xScale(1)),(graphController.graphSettings.xScale(1)),(0),(graphController.graphSettings.height));
        
        newAxis("LeftAxis",(graphController.graphSettings.xScale(-1)),(graphController.graphSettings.xScale(-1)),(0),(graphController.graphSettings.height));

        
        
        // Add horizontal axis
        newAxis("topAxis",(0),(graphController.graphSettings.width),graphController.graphSettings.yScale(1),(graphController.graphSettings.yScale(1)));
        
        newAxis("bottomAxis",(0),(graphController.graphSettings.width),(graphController.graphSettings.yScale(-1)),(graphController.graphSettings.yScale(-1)));

        
    }
}