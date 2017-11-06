$(document).ready(function(){


//------------------------------------------------------------------------------------------
// Global Vars
//------------------------------------------------------------------------------------------
  var animalButtons; // = ["Dog","Cat","Elephant","Hamster","Gerbil","Horse","Frog","Cow"];
  var lastButton = 0; //Last button added
  var myQuery1 = "https://api.giphy.com/v1/gifs/search?q=";
  var myQuery2 = "&api_key=KwfEioZVM2FKeKYifYLj9A1oI4aYYJWR&limit=10";
  var totalGifCount = 0;
  var lastGifsAdded = [];
  var gifLimit = 30;

//------------------------------------------------------------------------------------------
// Utility Functions
//------------------------------------------------------------------------------------------


// Function to build the initial animal buttons
function presentAnimalButtons () {
  var i;
  var classesA="col s12 waves-effect waves-light btn myButton z-depth-1 animals";

  //Clear out any buttons that were on the page
  $("#animalButtons").empty();

  var h = "Total Height: " + screen.height;
  var w = "Total Width: " + screen.width;
  console.log("Detected Screen Dimensions");
  console.log(h);
  console.log(w);

  //Loop through the current array of animalButtons and generate a button for each animal
  for (i = 0; i < animalButtons.length; i++) {
    lastButton = i;
    var a = $("<a></a>");
    var idString = "animalButton"+i;
    var iTag = $("<i></i>");
    iTag.addClass("material-icons left img-responsive");
    iTag.text("add_a_photo");
    // console.log("writing idString "+idString);
    a.attr("id", idString);
    a.attr("animal-name", animalButtons[i]);
    a.addClass(classesA);
    // a.addClass(classesB);
    a.text(animalButtons[i]);
    a.append(iTag);
    $("#animalButtons").append(a);
  }
        
}

// displayAnimalGifs does the "heavy lifting" to do the AJAX call to the GIPHY db and then
// process and display the results.
function displayAnimalGifs() {
        var thisAnimal = $(this).attr("animal-name");
        var queryURL = myQuery1 + thisAnimal + myQuery2;
        var gifCount = 0;

  

        // Creating an AJAX call for the specific animal button that was clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            // console.log(response);
            if (response.data.length === 0) {
              // console.log("No gifs found for "+thisAnimal);
              Materialize.toast('Sorry, no GIFs found for this animal "'+thisAnimal+'"', 4000,'rounded grey lighten-3 teal-text');
            } else {
              
              if (totalGifCount > gifLimit) {
                Materialize.toast('Gif Limit Reached - Remove Some Gifs to proceed', 4000,'rounded grey lighten-3 teal-text');
              }
              var results = response.data;
              // console.log("Length of results array is "+results.length);
              for (var i = 0; i < results.length; i++) {
                
                var rating = results[i].rating;
                // Check the rating -- we're only going to display "p" or "pg" rated gifs
              
                if (rating === "p" || rating === "pg") {
                  totalGifCount++;
                  gifCount++;
                  console.log("totalGifCount is ",totalGifCount);
                  var animalGifDiv = $("<div>");
                  var p = $("<p>").text("Rating: " + results[i].rating);
                  var animalImage = $("<img>");
                  animalImage.attr("src", results[i].images.fixed_height_still.url);
                  animalImage.attr("height","250px");
                  animalImage.attr("width","250px");
                  animalImage.attr("display","block");

                  animalImage.attr("data-still", results[i].images.fixed_height_still.url);
                  animalImage.attr("data-animate", results[i].images.fixed_height.url);
                  animalImage.attr("data-state", "still");
                  animalImage.attr("id", "gif"+totalGifCount);
                  animalImage.attr("class", "gif");
                  animalGifDiv.prepend(p);
                  animalGifDiv.prepend(animalImage);
                  $("#animalGifs").prepend(animalGifDiv);

                }
            }
            //We know how many GIFs were in the last set of GIFs added. Save off that value 
            //so we can use it if user clicks the "Remove Last Gifs" button.
            lastGifsAdded.push(gifCount);
            console.log("lastGifsAdded updated to ", gifCount);
    
          }
            
        })
    };

    function resetGame() {
      totalGifCount = 0;
      animalButtons = ["Dog","Cat","Elephant","Hamster","Gerbil","Horse","Frog","Cow"];
      presentAnimalButtons();

      
    }


    //------------------------------------------------------------------------
    // Event Handlers
    //------------------------------------------------------------------------

    // This function handles the click on the Submit button to add an animal
    // $("#addAnimal").on("click", function(event) {
    $("#newAnimalForm").submit(function() {
  
        event.preventDefault();
        // This line grabs the input from the textbox
        var newAnimal = $("#newAnimal").val().trim();
        // Adding animal name from the textbox to our array
        animalButtons.push(newAnimal);
        // Calling renderButtons which handles the processing of our hero array
        presentAnimalButtons();
    });

    // The next function is a piece of magic from https://stackoverflow.com/questions/6364289/clear-form-fields-with-jquery
    $(".reset").click(function() {
        $("#newAnimalform").trigger('reset'); 
    });
  
    // This function lets the user remove a button from the animalButtons div
   $(document).on("click","#removeButton", function(){
      
      console.log("lastButton is "+lastButton);
      if (lastButton < 0) {
        lastButton = 0;
      } else {
        var buttonToRemove = "#animalButton"+lastButton;
        animalButtons.pop(); 
        $(buttonToRemove).remove();
        lastButton--;
      }
      

   });

   // This function lets the user remove the last gifs added to the animalGifs div
   $(document).on("click","#removeGifs", function(){
      var i;
      var startRemove;
      var endRemove;
      var lastGifSet;
      
      lastGifSet = lastGifsAdded.pop();
      startRemove = totalGifCount; //start removing gifs with the very last one in the last set added
      endRemove = totalGifCount-lastGifSet; 
      for (i = startRemove; i>endRemove; i--){

        var gifToRemove = "gif"+i;
        console.log("I got here -- gif to remove is "+gifToRemove);
        $(gifToRemove).remove();
        totalGifCount--;
      }
      console.log("At end of removeGifs, totalGifCount is now ",totalGifCount);
      console.log("And end of lastGifsAdded array is ",lastGifsAdded[lastGifsAdded.length-1]);

   });
 

  // Next is the logic to display GIFs when an animal button is clicked
  $(document).on("click", ".animals", displayAnimalGifs);

  //The following logic toggles the data-state of the clicked gif -- Thanks Michael Ashe!!
  $(document).on("click", ".gif", function() {
        // console.log("GIF was clicked!");
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

  $(document).on("click","#resetGame", function() {
    resetGame();
  });



// -------------------------------------------------------------------------------------------------
// Code Execution Starts Here!
// -------------------------------------------------------------------------------------------------
// Get things going by calling resetGame() to display the original Animals array
  resetGame();
});