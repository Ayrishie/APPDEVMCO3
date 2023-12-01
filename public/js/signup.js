$(function () {
    $("form").on("submit", function (event) {
        event.preventDefault();
        const email = $("input[type='text']").val();
        const password = $("input[type='password']").val();

        if (email && password) {
            $.ajax({
                url: '/signup', // Server endpoint
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
                success: function() {
                    window.location.href = '/login'; // Redirect on success
                },
                error: function() {
                    $(".error").text("Signup failed. Please try again.").show();
                }
            });
        } else {
            $(".error").text("Incomplete details, please try again.").show();
        }
    });
});