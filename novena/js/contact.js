// (function ($) {
//     'use strict';

//     var form = $('.contact__form'),
//         message = $('.contact__msg'),
//         form_data;

//     // Success function
//     function done_func(response) {
//         message.fadeIn().removeClass('alert-danger').addClass('alert-success');
//         message.text(response);
//         setTimeout(function () {
//             message.fadeOut();
//         }, 2000);
//         form.find('input:not([type="submit"]), textarea').val('');
//     }

//     // fail function
//     function fail_func(data) {
//         message.fadeIn().removeClass('alert-success').addClass('alert-success');
//         message.text(data.responseText);
//         setTimeout(function () {
//             message.fadeOut();
//         }, 2000);
//     }
    
//     form.submit(function (e) {
//         e.preventDefault();
//         form_data = $(this).serialize();
//         $.ajax({
//             type: 'POST',
//             url: form.attr('action'),
//             data: form_data
//         })
//         .done(done_func)
//         .fail(fail_func);
//     });
    
// })(jQuery);

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const contactData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
        
        try {
            await fetchAPI('/Contacts', {
                method: 'POST',
                body: JSON.stringify(contactData)
            });
            
            // Success message
            const messageDiv = document.querySelector('.contact__msg');
            messageDiv.style.display = 'block';
            messageDiv.classList.remove('alert-danger');
            messageDiv.classList.add('alert-success');
            messageDiv.textContent = 'Your message was sent successfully!';
            
            // Clear form
            form.reset();
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            
            const messageDiv = document.querySelector('.contact__msg');
            messageDiv.style.display = 'block';
            messageDiv.classList.remove('alert-success');
            messageDiv.classList.add('alert-danger');
            messageDiv.textContent = 'Error sending message. Please try again.';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    });
});