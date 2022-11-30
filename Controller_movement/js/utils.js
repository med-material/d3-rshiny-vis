//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-22-2022                             */
/*      utils.js                                */
/*      v1_0_1                                  */
//////////////////////////////////////////////////

//Contains the various global functions for the operation of the program.




var utils = {
  
  test : function(){
    return "utils ok";
  },
  
  // Change the background color of the element with a time transition
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
  
};








