# Deviget Challenge - Lucas Ubaldini
Challenge developed in Cypress. To run it use the command "npm run cy:open" and select the spec.js file.

For the exercises I used cy.request() command to call the different APIs. For the last point (4) I had to add an IF statement because the amounts of pictures for one camera is greater to the others. My first idea was to use expect() statement to validate each camera but I couldn't because of that situation, that's why I used IF and ELSE to show a message with the result of the validation for each camera.
