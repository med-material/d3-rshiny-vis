


library(shiny)
library(r2d3)

data <- read.csv(file = "./Eyes_log_Sample.csv",stringsAsFactors = FALSE,
                    strip.white = TRUE,
                    sep = ";")



ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  
  d3Output("d3")
  

  
)




server <- function(input, output) {
  output$d3 <- renderD3({
    
    
    r2d3(
      data=data, 
      script = "main.js"
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)