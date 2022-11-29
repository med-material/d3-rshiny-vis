library(shiny)
library(r2d3)
library(tidyverse)
library(sp)

data <- read.csv(file = "Eyes_log_Sample.csv",stringsAsFactors = FALSE,
                    strip.white = TRUE,
                    sep = ";")


server <- function(input, output) {
  output$d3 <- renderD3({
    
    
    Maindata = data %>%filter(LocalGazeDirectionX != 'NULL')
    
    Eyes_Data = Maindata %>% select(LocalGazeDirectionX,LocalGazeDirectionY)
    
    Xtrem_points <- chull(Eyes_Data$LocalGazeDirectionX, Eyes_Data$LocalGazeDirectionY)
    
    ui <- fluidPage(
      verbatimTextOutput("selected"),
      
      d3Output("d3")
      
    )

    data <- list(
      "MainData" = Maindata,
      "hull_list" = Xtrem_points
    )
    
    data_to_json <- function(data) {
      jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = TRUE)
    } 

        
    r2d3(
      data= data_to_json(data),
      script = "main.js"
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)