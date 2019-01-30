// Initialize Firebase
var config = {
    apiKey: "AIzaSyCr_IyIUDnrbEFYXqjF6xl_JIWC3Rm-XLM",
    authDomain: "yi-s-rps.firebaseapp.com",
    databaseURL: "https://yi-s-rps.firebaseio.com",
    projectId: "yi-s-rps",
    storageBucket: "yi-s-rps.appspot.com",
    messagingSenderId: "677518738907"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// global vars
var player1In = false;
var player2In = false;
var win1 = 0;
var win2 = 0;
var loss1 = 0;
var loss2 = 0;
var tie1 = 0;
var tie2 = 0;
var pick1;
var pick2;
var intervalId;

//functions
  function player1Input(){
    database.ref().once("value").then(function(snapshot){
        player1In = snapshot.child("player1/player1In").val();
    });
    if (!player1In) {
        player1In = true;
        pick1 = $(this).attr("value");
        database.ref("/player1").set({
            pick1: pick1,
            player1In: player1In
        })
    };
  };

  function player2Input(){
    database.ref().once("value").then(function(snapshot){
        player2In = snapshot.child("player2/player2In").val();
    });
    if (!player2In) {
        player2In = true;
        pick2 = $(this).attr("value");
        database.ref("/player2").set({
            pick2: pick2,
            player2In: player2In
        })
    };
  };

  function checkResult(pick1, pick2) {
    $("#message").empty();
    if ((pick1 === "r" && pick2 === "s") ||
    (pick1 === "s" && pick2 === "p") || 
    (pick1 === "p" && pick2 === "r")) {
        win1++;
        loss2++;
        $("#result").text("Player 1 Won!");
    } else if (pick1 === pick2) {
        tie1++;
        tie2++;
        $("#result").text("It's a tie!");
    } else {
        loss1++;
        win2++;
        $("#result").text("Player 2 Won!");
    };
    $("#win1").text(win1);
    $("#win2").text(win2);
    $("#loss1").text(loss1);
    $("#loss2").text(loss2);
    $("#tie1").text(tie1);
    $("#tie2").text(tie2);
  };

  function reset(){
    clearInterval(intervalId);
    pick1 = "";
    player1In = false;  
    database.ref("/player1").set({
        pick1: pick1,
        player1In: player1In
    });
    pick2 = "";
    player2In = false;
    database.ref("/player2").set({
        pick2: pick2,
        player2In: player2In
    });
    $("#result").empty();
  }


//script starts
  $(".player1").on("click", player1Input);

  $(".player2").on("click", player2Input);

  database.ref().on("value", function(snapshot) {
    player1In = snapshot.child("player1/player1In").val();
    player2In = snapshot.child("player2/player2In").val();
    if (player1In && player2In) {
        pick1 = snapshot.child("player1/pick1").val();
        pick2 = snapshot.child("player2/pick2").val();
        checkResult(pick1, pick2);
        clearInterval(intervalId);
        intervalId = setInterval(reset, 3000);
    }
    else if (!player1In && !player2In) {
        $("#message").text("Waiting for players to start!");
    }
    else if (player1In && !player2In) {
        $("#message").text("Waiting for Player 2 to pick!");
    }
    else if (!player1In && player2In) {
        $("#message").text("Waiting for Player 1 to pick!");
    }
  });

  database.ref("/player1").onDisconnect().set({
    pick1: "",
    player1In: false
  });

  database.ref("/player2").onDisconnect().set({
    pick2: "",
    player2In: false
  });