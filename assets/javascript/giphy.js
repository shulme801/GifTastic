$(document).ready(function(){

  var animalButtons = ["Dog","Cat","Elephant","Hamster","Gerbil","Horse","Otter","Cow"];

 console.log("I got here")

 var myQuery1 = "https://api.giphy.com/v1/gifs/search?q=";
 var myQuery2 = "&api_key=KwfEioZVM2FKeKYifYLj9A1oI4aYYJWR&limit=10";

// Function to build the initial animal buttons
function presentAnimalButtons () {
  var i;
  var classesA="col s12 waves-effect waves-light btn myButton z-depth-1 animals";
  var iTag = "<i class=\"material-icons left img-responsive\">add_a_photo</i>";
  //Clear out any buttons that were on the page
  $("#animalButtons").empty();

  //Loop through the current array of animalButtons and generate a button for each animal
  for (i = 0; i < animalButtons.length; i++) {
    var a = $("<a><i class=\"material-icons left img-responsive\">add_a_photo</i></a>");
    var idString = "animalButton"+i;
    // console.log("writing idString "+idString);
    a.attr("id", idString);
    a.attr("animal-name", animalButtons[i]);
    a.addClass(classesA);
    
    a.text(animalButtons[i]);
    $("#animalButtons").append(a);

    // <a id="animalButton1" class="col s12 waves-effect waves-light btn myButton z-depth-1"><i class="material-icons left img-responsive">add_a_photo</i>Dog</a>
                    
  }
  console.log("Animal Buttons div was initialized");
        
}

// displayAnimalGifs does the "heavy lifting" to do the AJAX call to the GIPHY db and then
// process and display the results.
function displayAnimalGifs() {
        var thisAnimal = $(this).attr("animal-name");
        var queryURL = myQuery1 + thisAnimal + myQuery2;
        // Creating an AJAX call for the specific animal button that was clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            console.log(response);
            var results = response.data;
            console.log("Length of results array is "+results.length);
            for (var i = 0; i < results.length; i++) {

                var rating = results[i].rating;
                // Check the rating -- we're only going to display "p" or "pg" rated gifs
                if (rating === "p" || rating === "pg") {
                  var animalGifDiv = $("<div>");
                  var p = $("<p>").text("Rating: " + results[i].rating);
                  var animalImage = $("<img>");
                  animalImage.attr("src", results[i].images.fixed_height_still.url);
                  animalImage.attr("data-still", results[i].images.fixed_height_still.url);
                  animalImage.attr("data-animate", results[i].images.fixed_height.url);
                  animalImage.attr("data-state", "still");
                  animalImage.attr("class", "gif");
                  animalGifDiv.prepend(p);
                  animalGifDiv.prepend(animalImage);
                  $("#animalGifs").prepend(animalGifDiv);
                }
            }
        })
    };

// This function handles the click on the Submit button to add an animal
    $("#addAnimal").on("click", function(event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var newAnimal = $("#newAnimal").val().trim();
        // Adding hero from the textbox to our array
        animalButtons.push(newAnimal);
        // Calling renderButtons which handles the processing of our hero array
        presentAnimalButtons();
    });
   



  // Next is the logic to display GIFs when an animal button is clicked
  $(document).on("click", ".animals", displayAnimalGifs);

  //The following logic toggles the data-state of the clicked gif
  $(document).on("click", ".gif", function() {
        console.log("GIF was clicked!");
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

// Get things going by calling presentAnimalButtons() to display the original Animals array
  presentAnimalButtons();

});