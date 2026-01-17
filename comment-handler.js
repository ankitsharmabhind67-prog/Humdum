// Comment section handler
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('comment-form');
    const commentMessage = document.getElementById('comment-message');
    const commentsDisplay = document.getElementById('comments-display');
    
    // Load comments from localStorage on page load
    loadCommentsFromStorage();
    
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value.trim();
            const email = document.getElementById('comment-email').value.trim();
            const message = document.getElementById('comment-text').value.trim();
            
            // Validate inputs
            if (!name || !email || !message) {
                showCommentMessage('❌ Please fill all fields', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showCommentMessage('❌ Please enter a valid email', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.comment-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Posting... 💭';
            submitBtn.disabled = true;
            
            // Always display comment immediately without waiting for email
            displayComment(name, email, message);
            saveCommentToStorage(name, email, message);
            
            // Show success message
            showCommentMessage('✅ Comment posted successfully! Thank you! 💕', 'success');
            
            // Reset form
            commentForm.reset();
            
            // Auto-hide message after 4 seconds
            setTimeout(() => {
                commentMessage.style.display = 'none';
            }, 4000);
            
            // Send email in background without blocking UI (fire and forget)
            fetch('https://formsubmit.co/vanshporwal780@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `New Comment from ${name}`,
                    _replyto: email
                })
            }).catch(() => {
                // Silently ignore email errors - comment is already saved locally
            });
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    function displayComment(name, email, message) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.innerHTML = `
            <div class="comment-content">
                <div class="comment-header-item">
                    <strong class="comment-name">${escapeHtml(name)}</strong>
                    <span class="comment-email">${escapeHtml(email)}</span>
                </div>
                <p class="comment-text">${escapeHtml(message)}</p>
                <span class="comment-time">${new Date().toLocaleString()}</span>
            </div>
        `;
        
        // Add to top of comments display
        commentsDisplay.insertBefore(commentDiv, commentsDisplay.firstChild);
    }
    
    function saveCommentToStorage(name, email, message) {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.unshift({
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    
    function loadCommentsFromStorage() {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.forEach(comment => {
            displayComment(comment.name, comment.email, comment.message);
        });
    }
    
    function showCommentMessage(text, type) {
        commentMessage.textContent = text;
        commentMessage.className = `comment-message ${type}`;
        commentMessage.style.display = 'block';
    }
    
    // Helper function to escape HTML special characters
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

