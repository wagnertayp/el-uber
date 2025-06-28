// Driver Selector Buttons - Force correct styling
(function() {
    'use strict';
    
    function initializeDriverButtons() {
        const yesButton = document.getElementById('app-driver-yes');
        const noButton = document.getElementById('app-driver-no');
        const hiddenInput = document.getElementById('is_app_driver');
        const registrationForm = document.getElementById('registration-form');
        
        if (!yesButton || !noButton || !hiddenInput) return;
        
        // Set initial state - no selection, form hidden
        hiddenInput.value = '';
        
        // Hide the form initially
        if (registrationForm) {
            registrationForm.style.display = 'none';
        }
        
        // Force both buttons to unselected state initially
        const unselectedStyles = `
            background-color: #ffffff !important;
            color: #6b7280 !important;
            border: 2px solid #d1d5db !important;
            border-radius: 0px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8) !important;
            padding: 8px 32px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
        `;
        
        yesButton.style.cssText = unselectedStyles;
        noButton.style.cssText = unselectedStyles;
        
        // Set correct classes
        yesButton.className = 'driver-selector unselected px-8 py-2 border-2 font-semibold transition-all duration-200';
        noButton.className = 'driver-selector unselected px-8 py-2 border-2 font-semibold transition-all duration-200';
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDriverButtons);
    } else {
        initializeDriverButtons();
    }
    
    // Re-initialize after a short delay to override any conflicting styles
    setTimeout(initializeDriverButtons, 100);
    setTimeout(initializeDriverButtons, 500);
    
})();

// Global function for button selection
function selectDriverType(type) {
    const yesButton = document.getElementById('app-driver-yes');
    const noButton = document.getElementById('app-driver-no');
    const hiddenInput = document.getElementById('is_app_driver');
    const registrationForm = document.getElementById('registration-form');
    
    if (!yesButton || !noButton || !hiddenInput) return;
    
    // Common styles for unselected state
    const unselectedStyles = `
        background-color: #ffffff !important;
        color: #6b7280 !important;
        border: 2px solid #d1d5db !important;
        border-radius: 0px !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8) !important;
        padding: 8px 32px !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
    `;
    
    // Common styles for selected state
    const selectedStyles = `
        background-color: #000000 !important;
        color: #ffffff !important;
        border: 2px solid #000000 !important;
        border-radius: 0px !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important;
        padding: 8px 32px !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
    `;
    
    if (type === 'yes') {
        yesButton.style.cssText = selectedStyles;
        noButton.style.cssText = unselectedStyles;
        yesButton.className = 'driver-selector selected px-8 py-2 border-2 font-semibold transition-all duration-200';
        noButton.className = 'driver-selector unselected px-8 py-2 border-2 font-semibold transition-all duration-200';
        hiddenInput.value = 'yes';
        localStorage.setItem('isAppDriver', 'yes');
    } else {
        noButton.style.cssText = selectedStyles;
        yesButton.style.cssText = unselectedStyles;
        noButton.className = 'driver-selector selected px-8 py-2 border-2 font-semibold transition-all duration-200';
        yesButton.className = 'driver-selector unselected px-8 py-2 border-2 font-semibold transition-all duration-200';
        hiddenInput.value = 'no';
        localStorage.setItem('isAppDriver', 'no');
    }
    
    // Show the registration form when either option is selected
    if (registrationForm) {
        registrationForm.style.display = 'block';
    }
}