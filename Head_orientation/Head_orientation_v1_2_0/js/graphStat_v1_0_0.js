//////////////////////////////////////////////////
/*      Graph D3.js headOrientationStat_v2      */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-16-2022                             */
/*      graphStat.js                            */
//////////////////////////////////////////////////

//Contains all the functions necessary for the operation of the wall display.

/*
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

*/


var graphStat = {
  
  graphSettings : {
        height : 265,//px
        width : 550,//px
        
        marginTop : 290,//px
        marginLeft : 125,//px
        
        
        valueMax : 2,
        
        
        headSize : 80,//px
        headColor : "#757575",
      
      
        displayHeadPoint : false,
        displayFieldOfViewState : false,
    
    },
    
    test : function(){
        return 1;
    },
    
    addHeadPoint : function(){ // add a point as an head 
      
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
    }
    
   
}