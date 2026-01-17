// Email form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending... ❤️';
            submitBtn.disabled = true;
            
            try {
                // Send email using Formspree
                const response = await fetch('https://formspree.io/f/xyzapdvq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Love Message from ${name}`,
                        _replyto: email
                    })
                });
                
                if (response.ok) {
                    // Success message
                    formMessage.innerHTML = '✅ <strong>Message Sent Successfully!</strong> Your love message has been delivered. Thank you for sharing! 💕';
                    formMessage.style.display = 'block';
                    formMessage.style.color = '#28a745';
                    formMessage.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                    formMessage.style.padding = '15px';
                    formMessage.style.borderRadius = '8px';
                    formMessage.style.marginTop = '15px';
                    formMessage.style.border = '1px solid #28a745';
                    
                    // Reset form
                    this.reset();
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                formMessage.innerHTML = '❌ <strong>Error Sending Message</strong> Please try again later or contact us directly.';
                formMessage.style.display = 'block';
                formMessage.style.color = '#dc3545';
                formMessage.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                formMessage.style.padding = '15px';
                formMessage.style.borderRadius = '8px';
                formMessage.style.marginTop = '15px';
                formMessage.style.border = '1px solid #dc3545';
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
