$(document).ready(function(){


 console.log("I got here")
 queryTerm = "baseball";
 var myQuery = "https://api.giphy.com/v1/gifs/search?q=" +
        queryTerm + "&api_key=KwfEioZVM2FKeKYifYLj9A1oI4aYYJWR&limit=10";


   // Performing our AJAX GET request
   $.ajax({
            url: myQuery,
            method: "GET"
          })
          // After the data comes back from the API
          .done(function(response) {
            // Storing an array of results in the results variable
            var results = response.data;
            console.log("Response Data ",response.data);
  });

});