#//////////////////////////////////////////////////
#/*      CREATE Aalborg University               */
#/*      aldsanms                                */
#/*      dec-01-2022                             */
#/*      app.R                                   */
#/*      Controller_movement                     */
#/*      v_1_2_3                                 */
#//////////////////////////////////////////////////


library(shiny)
library(r2d3)
library(tidyverse)
library(sp)
source("utils/loadrawdata.R")
options("digits.secs"=6)


#loading data
AllData <- LoadFromDirectory("data")


#retrieval of information necessary for the construction of the wall
Moles <- unique(
  AllData %>% 
    filter(filename == "data/log_Event.csv") %>% 
    select(MoleId,MolePositionLocalX,MolePositionLocalY,WallColumnCount,WallRowCount) %>%  
    filter(!is.na(MoleId))
)

WallInfo <- data.frame( 
  x_extrem = c(
    min(as.double(Moles$MolePositionLocalX)),
    max(as.double(Moles$MolePositionLocalX))
  ),
  y_extrem = c(
    min(as.double(Moles$MolePositionLocalY)),
    max(as.double(Moles$MolePositionLocalY))
  ),
  n_col_row = c(
    unique(Moles$WallColumnCount),
    unique(Moles$WallRowCount)
  )
)


data_to_json <- function(data) {
  jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = TRUE)
} 

data <- list(
  "wallInfo" = WallInfo,
  "aed" = (AllData %>% filter(filename == "data/log_Event.csv")),
  "ad" = (AllData %>% filter(filename == "data/log_Sample.csv"))
  )

ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  
  d3Output("pageGraph")
  
)




server <- function(input, output) {
  output$pageGraph <- renderD3({
    
    
    r2d3(
      data= data_to_json(data),
      script = "js/main.js",
      dependencies = list("js/wall.js", #v2_1_0
                          "js/utils.js", #v_1_0_1
                          "js/graphController.js", #v_1_1_0
                          "js/slider.js" #v_1_1_0
                          )
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)



