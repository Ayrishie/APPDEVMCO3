$(function(){
    function is_filled(){
        const email = validator.trim($(".input-email").val());
        const password = validator.trim($(".input-password").val());

        return !(validator.isEmpty(email)) && !(validator.isEmpty(password));
    }

    function is_valid_email(input_field, callback_function){
        const email = validator.trim($(".input-email").val());

        if(!validator.isEmpty(email)){
            $.ajax("/checkEmail", {
                data:{
                    email
                }
            }).done((data) => {
                if(data.email !== validator.trim($(".input-email").val())) {
                    if (input_field.is($(".input-email")))
                        $(".error-email").text("");

                    return callback_function(true)
                } else {
                    if (input_field.is($(".input-email")))
                        $(".error-email").text("Email is already registered.");

                    return callback_function(false)
                }
            });
        }
    }

    function is_valid_password(input_field){
        const password = validator.trim($(".input-password").val());
        let is_valid_password = false;

        if(validator.isLength(password, { min: 8 })) {
            if (input_field.is($(".input-password"))){
                $(".error-password").text("");

                is_valid_password = true;
            }
        } else
            if(input_field.is($(".input-password")))
                $(".error-password").text("Password must at least be 8 characters.");

        return is_valid_password;
    }

    function validate_field(input_field, input_field_name, error_container){
        const empty_field = validator.isEmpty(validator.trim(input_field.val()));

        if(empty_field){
            input_field.prop("value", "");
            error_container.text(input_field_name + " cannot be empty.");
        } else
            error_container.text("");

        const filled = is_filled();
        const valid_password= is_valid_password(input_field);

        is_valid_email(input_field, (valid_email) => {
            if(filled && valid_password && valid_email)
                $("input[type='submit']").prop("disabled", false);
            else
                $("input[type='submit']").prop("disabled", true);
        });
    }

    $(".input-email").keyup(function(){
        validate_field($(".input-email"), "Email", $(".error-email"));
    });

    $(".input-password").keyup(function(){
        validate_field($(".input-password"), "Password", $(".error-password"));
    });
});

/*
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
                    $(".error").text("Signup failed. Please try again.");
                }
            });
        } else {
            $(".error").text("Incomplete details, please try again.");
        }
    });
});
*/