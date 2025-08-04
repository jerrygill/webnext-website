/**
 * Contact Form Handler
 * Handles form submission with validation and success/error messaging
 */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.originalBtnText = this.submitBtn?.innerHTML;
        this.init();
    }

    init() {
        if (!this.form) return;
        
        // Add form submission handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        this.addValidation();
        
        // Initialize nice-select for service dropdown
        this.initServiceDropdown();
    }

    addValidation() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearError(field);

        if (!value && field.hasAttribute('required')) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-clt');
        if (!formGroup) return;

        // Add error class
        formGroup.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insert error message
        formGroup.appendChild(errorElement);
    }

    clearError(field) {
        const formGroup = field.closest('.form-clt');
        if (!formGroup) return;

        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    initServiceDropdown() {
        const dropdown = this.form.querySelector('.nice-select');
        if (!dropdown) return;

        const options = dropdown.querySelectorAll('.option');
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'service';
        hiddenInput.value = 'Service'; // Default value
        this.form.appendChild(hiddenInput);

        options.forEach(option => {
            option.addEventListener('click', () => {
                hiddenInput.value = option.textContent.trim();
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isFormValid = this.validateForm();
        if (!isFormValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Submit form (using Netlify Forms)
            const response = await this.submitToNetlify(formData);
            
            if (response.ok) {
                this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.form.reset();
                this.resetNiceSelect();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitToNetlify(formData) {
        // Check if running locally or on Netlify
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            // For local development, simulate successful submission
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve({ message: 'Form submitted successfully (local mode)' })
                    });
                }, 1000); // Simulate network delay
            });
        } else {
            // For production, use Netlify function
            return fetch('/.netlify/functions/contact-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setLoadingState(loading) {
        if (!this.submitBtn) return;

        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalBtnText;
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Insert message at the top of the form
        this.form.insertBefore(messageElement, this.form.firstChild);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }

        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    resetNiceSelect() {
        const dropdown = this.form.querySelector('.nice-select');
        if (dropdown) {
            const current = dropdown.querySelector('.current');
            const firstOption = dropdown.querySelector('.option');
            if (current && firstOption) {
                current.textContent = firstOption.textContent;
                
                // Remove selected class from all options
                dropdown.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected', 'focus');
                });
                
                // Add selected class to first option
                firstOption.classList.add('selected', 'focus');
            }
        }
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});

// Add CSS for form styling
const formStyles = `
<style>
.form-clt.error input,
.form-clt.error textarea {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.form-message {
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid;
}

.form-message.success {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
}

.form-message.error {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
}

.message-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.message-content i {
    font-size: 1.1rem;
}

.form-clt input:focus,
.form-clt textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.form-message {
    animation: fadeIn 0.3s ease-out;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', formStyles);