(function ($) {
    "use strict";

    // Function to validate email
    function isValidEmail(email) {
        var emailPattern = /^([a-zA-Z0-9_\-\.]+)@(etud\.)?univ-ubs\.fr$/;
        return emailPattern.test(email);
    }

    // Function to sanitize input
    function sanitizeInput(input) {
        // Remove leading and trailing whitespace
        //input = input.trim();
        
        // Create a pattern to match any of the disallowed tags
        const disallowedTags = ['script', 'iframe', 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'];
        const disallowedPattern = new RegExp(
            `<(${disallowedTags.join('|')})\\b[^<]*(?:(?!</\\1>)<[^<]*)*</\\1>`,
            'gi'
        );
        console.log(input);

        // Remove content between disallowed tags
        input = input.replace(disallowedPattern, '');
        console.log(input);

        // Prevent XSS by escaping HTML entities
        input = input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        console.log(input);
        return input;
      }
    
    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function() {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    });

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        var check = true;

        for (var i = 0; i < input.length; i++) {
            if ($(input[i]).attr('type') === 'email' || $(input[i]).attr('name') === 'email') {
                if (!isValidEmail($(input[i]).val().trim())) {
                    showValidate(input[i]);
                    check = false;
                }
            } else {
                if ($(input[i]).val().trim() === '') {
                    showValidate(input[i]);
                    check = false;
                }
            }
        }

        if (check) {
            // Form data is valid, proceed with sending it to the server
            var email = sanitizeInput($('input[name="email"]').val());
            var password = sanitizeInput($('input[name="pass"]').val());
            var csrfToken = $('input[name="_csrf"]').val(); // Get the CSRF token from the hidden input
            
            // Create a data object to send as JSON
            var data = {
                email: email,
                password: password,
                _csrf: csrfToken // Include the CSRF token in the data
            };

            // Make an AJAX POST request to your authentication endpoint
            $.ajax({
                type: 'POST',
                url: '/api/v1/auth/user-auth', // Update this URL if needed
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {  
                    // Handle a successful authentication response here
                    console.log('Authentication successful:', response);
                    // Redirect to the dashboard page
                    window.location.href = '/dashboard';
                },
                error: function (xhr, textStatus, error) {
                    // Handle errors here
                    console.error('Authentication failed:', error);
                }
            });
        }

        return check;
    });

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);
