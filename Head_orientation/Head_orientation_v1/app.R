
library(shiny)
library(r2d3)
library(tidyverse)

AllEventData <- read.csv(file = "data/log_Event.csv",stringsAsFactors = FALSE,
                    strip.white = TRUE,                    sep = ";")

AllData <- read.csv(file = "data/log_Sample.csv",stringsAsFactors = FALSE,
                         strip.white = TRUE,                    sep = ";")

#AllData %>% select(Event, MoleIndexX, MoleIndexY, CurrentMoleToHitId , MoleId) %>% view()

  
  

#MoleData <- read.csv(file = "data/MoleData.csv",stringsAsFactors = FALSE,
 #                   strip.white = TRUE,
  #                  sep = ",")

AllMole <- read.csv(file = "data/AllMole.csv",stringsAsFactors = FALSE,
                     strip.white = TRUE,
                    sep = ",")

#LaserData <- read.csv(file = "data/LaserData.csv",stringsAsFactors = FALSE,
#                         strip.white = TRUE,
#                         sep = ",")





data_to_json <- function(data) {
  jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = TRUE)
} 

data <- list("am" = AllMole,"aed" = AllEventData,"ad" = AllData)

ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  
  d3Output("d3")
  
)




server <- function(input, output) {
  output$d3 <- renderD3({
    
    
    r2d3(
      data= data_to_json(data),
      script = "js/main.js"
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)