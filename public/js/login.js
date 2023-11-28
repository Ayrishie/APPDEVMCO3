$(function () {
    $("form").on("submit", function (event) {
        event.preventDefault();
        const email = $("input[type='text']").val();
        const password = $("input[type='password']").val();

        if (email && password) {
            $.ajax({
                url: '/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
                success: function() {
                    window.location.href = 'http://localhost:3000'; // Redirect to the main page
                },
                error: function() {
                    $(".error").text("Invalid login. Please try again.").show();
                }
            });
        } else {
            $(".error").text("Incomplete details, please try again.").show();
        }
    });
});
