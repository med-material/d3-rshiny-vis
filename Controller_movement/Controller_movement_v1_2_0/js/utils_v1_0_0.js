//////////////////////////////////////////////////
/*                                              */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-22-2022                             */
/*      utils_v1_0_0.js                         */
//////////////////////////////////////////////////

//Contains the various global functions for the operation of the program.




var utils = {
  
  test : function(){
    return "utils ok";
  },
  
  changeFillElement : function(element = {}, color="#00000000",duration = 0){
    element.transition()
        .duration(duration)
        .attr('fill', color);
  },


  addPointOnSvg : function(svg01={},r=2,x=0,y=0,color="blue"){
    return (
      svg01.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', r)
        .attr('fill', color)
      );
  },


  addElement : function(element = "div",back = {},style = [""]){
    return(
      back.append(element)
        .attr('style',style)
    );
  },
  
  clock : function(){
  
  if(mouvementSettings.isStart){
  
      wall.changeLaserLocation();
      wall.changeMolesState();
      graphController.changeControllerLocation();
      
      mouvementSettings.index ++;
      DataArrays.indexDate = new Date(DataArrays.dateMin.getTime()  + 14*mouvementSettings.index); // add 100  Msecond to the curent index date 
    
      slider.sliderSettings.objSlider.value = mouvementSettings.index;
  }
  
  setTimeout(utils.clock, 14);// call clock function in 1000 ms
  
}
  
};








