
library(shiny)
library(r2d3)
library(tidyverse)
library(sp)
source("utils/loadrawdata.R")
options("digits.secs"=6)





AllMole <- read.csv(file = "data/AllMoles.csv",stringsAsFactors = FALSE,
                     strip.white = TRUE,
                     sep = ";")


D <- LoadFromDirectory("data")



data_to_json <- function(data) {
  jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = TRUE)
} 

data <- list(
  "am" = AllMole,
  "aed" = (D %>% filter(filename == "data/log_Event.csv")),
  "ad" = (D %>% filter(filename == "data/log_Sample.csv"))
  )

ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  
  d3Output("d3")
  
)




server <- function(input, output) {
  output$d3 <- renderD3({
    
    
    r2d3(
      data= data_to_json(data),
      script = "js/main.js",
      dependencies = list("js/wall_v1_0_0.js",
                          "js/utils_v1_0_0.js",
                          "js/graphController_v1_0_0.js",
                          "js/slider_v1_0_0.js"
                          )
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)



