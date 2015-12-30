$("#sensing_details").load("includes/intro.html");

$("#btnTemp")
    .mouseover(function(){
        $(".temp").css("opacity", 100);
        $("#sensing_details").load("includes/temp.html");
    })
    .mouseout(function(){
        $(".temp").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnHumidity")
    .mouseover(function(){
        $(".humidity").css("opacity", 100);
        $("#sensing_details").load("includes/humidity.html");
    })
    .mouseout(function(){
        $(".humidity").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnWeight")
    .mouseover(function(){
        $(".weight").css("opacity", 100);
        $("#sensing_details").load("includes/weight.html");
    })
    .mouseout(function(){
        $(".weight").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnPresence")
    .mouseover(function(){
        $(".presence").css("opacity", 100);
        $("#sensing_details").load("includes/presence.html");
    })
    .mouseout(function(){
        $(".presence").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnMotion")
    .mouseover(function(){
        $(".motion").css("opacity", 100);
        $("#sensing_details").load("includes/motion.html");
    })
    .mouseout(function(){
        $(".motion").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnLight")
    .mouseover(function(){
        $(".light").css("opacity", 100);
        $("#sensing_details").load("includes/light.html");
    })
    .mouseout(function(){
        $(".light").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });