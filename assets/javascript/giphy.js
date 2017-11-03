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
            for (var i = 0; i < results.length; i++) {

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
        })
    };

   // Performing our AJAX GET request
  //  $.ajax({
  //           url: myQuery,
  //           method: "GET"
  //         })
  //         // After the data comes back from the API
  //         .done(function(response) {
  //           // Storing an array of results in the results variable
  //           var results = response.data;
  //           console.log("Response Data ",response.data);
  // });

  presentAnimalButtons();

  // Next is the logic to display GIFs when an animal button is clicked
  $(document).on("click", ".animals", displayAnimalGifs);


});