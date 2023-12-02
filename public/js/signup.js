$(function(){
    function is_filled(){
        return !(validator.isEmpty(validator.trim($(".input-email").val()))) && !(validator.isEmpty(validator.trim($(".input-password").val())));
    }

    function is_valid_email(input_field, callback_function){
        if(!validator.isEmpty(validator.trim($(".input-email").val()))){
            $.ajax("/checkEmail", {
                data:{
                    email: validator.trim($(".input-email").val())
                }
            }).done((data) => {
                if(data.email !== validator.trim($(".input-email").val())) {
                    if (input_field.is($(".input-email")))
                        $(".error-email").hide().text("");

                    return callback_function(true);
                } else {
                    if (input_field.is($(".input-email")))
                        $(".error-email").show().text("Email is already registered.");

                    return callback_function(false);
                }
            });
        }
    }

    function is_valid_password(input_field){
        if(validator.isLength(validator.trim($(".input-password").val()), {min: 8})) {
            if (input_field.is($(".input-password"))){
                $(".error-password").hide().text("");

                return true;
            }
        } else
            if(input_field.is($(".input-password"))){
                $(".error-password").show().text("Password must at least be 8 characters.");

                return false;
            }

        return false;
    }

    function validate_field(input_field, input_field_name, error_container){
        if(validator.isEmpty(validator.trim(input_field.val()))){
            input_field.prop("value", "");
            error_container.show().text(input_field_name + " cannot be empty.");
        } else
            error_container.text("");

        const valid_password = is_valid_password(input_field);

        is_valid_email(input_field, function(valid_email){
            if(is_filled() && valid_password && valid_email)
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
                    $(".error").text("Signup failed. Please try again.").show();
                }
            });
        } else {
            $(".error").text("Incomplete details, please try again.").show();
        }
    });
});
*/