$(function (){
    $(window).on("beforeunload", function(){
        $.ajax("/logout");
    });
});