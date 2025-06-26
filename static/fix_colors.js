// Global script to force all button and footer text colors to be white
console.log('Fix colors script loaded - forcing white text on buttons and footer');

document.addEventListener('DOMContentLoaded', function() {
    // Force all buttons to be black with white text
    const buttons = document.querySelectorAll('button, .btn, input[type="submit"], input[type="button"], .bg-prosegur-blue, .bg-blue-600, .bg-blue-500, .bg-green-600');
    buttons.forEach(btn => {
        btn.style.setProperty('background', '#000', 'important');
        btn.style.setProperty('color', '#fff', 'important');
        btn.style.setProperty('border-radius', '2px', 'important');
        btn.style.setProperty('border', 'none', 'important');
        btn.style.setProperty('font-weight', '700', 'important');
        
        btn.addEventListener('mouseover', function() {
            this.style.setProperty('background', '#222', 'important');
            this.style.setProperty('color', '#fff', 'important');
        });
        
        btn.addEventListener('mouseout', function() {
            this.style.setProperty('background', '#000', 'important');
            this.style.setProperty('color', '#fff', 'important');
        });
    });
    
    // Force all footer text to be white - more aggressive targeting
    const footerElements = document.querySelectorAll('footer, footer *, footer a, footer span, footer p, footer div, footer li, footer .text-white, footer .text-base');
    footerElements.forEach(el => {
        el.style.setProperty('color', '#fff', 'important');
        // Remove any text color classes that might interfere
        el.classList.remove('text-gray-400', 'text-gray-500', 'text-gray-600');
        el.classList.add('text-white');
    });
    
    // Fix any remaining gray text in buttons or important elements
    const grayTexts = document.querySelectorAll('.text-gray-600, .text-gray-700, .text-gray-500, .text-gray-900, .text-gray-400');
    grayTexts.forEach(el => {
        if (el.closest('button') || el.closest('footer')) {
            el.style.setProperty('color', '#fff', 'important');
        }
    });
    
    console.log('Button and footer colors forced to white');
});

// Add global CSS to override any remaining issues
const style = document.createElement('style');
style.textContent = `
    /* FORCE WHITE TEXT ON ALL BUTTONS AND FOOTER */
    button, .btn, input[type="submit"], input[type="button"], 
    .bg-prosegur-blue, .bg-blue-600, .bg-blue-500, .bg-green-600,
    .bg-red-500, .bg-red-600, .bg-red-700 {
        background: #000 !important;
        color: #fff !important;
        border-radius: 2px !important;
        border: none !important;
        font-weight: 700 !important;
    }
    button:hover, .btn:hover, input[type="submit"]:hover, input[type="button"]:hover,
    .bg-prosegur-blue:hover, .bg-blue-600:hover, .bg-blue-500:hover, .bg-green-600:hover,
    .bg-red-500:hover, .bg-red-600:hover, .bg-red-700:hover {
        background: #222 !important;
        color: #fff !important;
    }
    footer, footer *, footer a, footer span, footer p, footer div, footer li {
        color: #fff !important;
    }
    button .text-gray-600, button .text-gray-700, button .text-gray-500, button .text-gray-900, button .text-gray-400,
    footer .text-gray-600, footer .text-gray-700, footer .text-gray-500, footer .text-gray-900, footer .text-gray-400 {
        color: #fff !important;
    }
    /* Override any text color classes in footer and buttons */
    button [class*="text-gray"], footer [class*="text-gray"] {
        color: #fff !important;
    }
`;
document.head.appendChild(style);

console.log('Global CSS styles applied for white text on buttons and footer');