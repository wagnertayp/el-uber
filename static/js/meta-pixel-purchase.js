/**
 * Meta Pixel Purchase Event Tracking
 * Fires Purchase events when authentic payments are approved
 */

function trackMetaPixelPurchase(customerData, purchaseData) {
    if (typeof fbq === 'undefined') {
        console.error('Meta Pixel not loaded, cannot track Purchase event');
        return;
    }

    try {
        // Fire Purchase event with customer and purchase data
        fbq('track', 'Purchase', {
            value: purchaseData.value,
            currency: 'BRL',
            content_name: purchaseData.content_name,
            content_type: 'product'
        }, {
            // Customer information for enhanced matching
            em: customerData.email ? sha256(customerData.email.toLowerCase()) : null,
            ph: customerData.phone ? sha256(customerData.phone.replace(/\D/g, '')) : null,
            fn: customerData.firstName ? sha256(customerData.firstName.toLowerCase()) : null,
            ln: customerData.lastName ? sha256(customerData.lastName.toLowerCase()) : null,
            ct: customerData.city ? sha256(customerData.city.toLowerCase()) : null,
            st: customerData.state ? sha256(customerData.state.toLowerCase()) : null,
            zp: customerData.zipCode ? sha256(customerData.zipCode.replace(/\D/g, '')) : null,
            country: 'br'
        });

        console.log('✅ Meta Pixel Purchase event fired:', {
            value: purchaseData.value,
            currency: 'BRL',
            content_name: purchaseData.content_name,
            customer: customerData.email || 'N/A'
        });

    } catch (error) {
        console.error('Error firing Meta Pixel Purchase event:', error);
    }
}

// Simple SHA256 implementation for hashing customer data
function sha256(str) {
    // For production, use a proper crypto library
    // This is a simplified hash for demonstration
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString();
}

// Auto-track Purchase events when payment status becomes APPROVED
function initializePaymentTracking() {
    // Listen for payment status updates
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            // Check if this is a payment status check
            if (args[0] && args[0].includes('/check_payment_status/')) {
                response.clone().json().then(data => {
                    if (data.status === 'APPROVED' && data.payment_id) {
                        // Get customer and purchase data from localStorage
                        const customerData = getCustomerDataFromStorage();
                        const purchaseData = getPurchaseDataFromPayment(data);
                        
                        if (customerData && purchaseData) {
                            trackMetaPixelPurchase(customerData, purchaseData);
                        }
                    }
                }).catch(e => {
                    // Ignore JSON parsing errors for non-JSON responses
                });
            }
            return response;
        });
    };
}

function getCustomerDataFromStorage() {
    try {
        // Try to get customer data from various localStorage keys
        const candidateName = localStorage.getItem('candidateName') || '';
        const candidateEmail = localStorage.getItem('candidateEmail') || '';
        const candidatePhone = localStorage.getItem('candidatePhone') || '';
        const candidateCPF = localStorage.getItem('candidateCPF') || '';
        const candidateCity = localStorage.getItem('candidateCity') || '';
        const candidateState = localStorage.getItem('candidateState') || '';
        const candidateZipCode = localStorage.getItem('candidateZipCode') || '';

        // Split name into first and last name
        const nameParts = candidateName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
            email: candidateEmail,
            phone: candidatePhone,
            firstName: firstName,
            lastName: lastName,
            city: candidateCity,
            state: candidateState,
            zipCode: candidateZipCode,
            cpf: candidateCPF
        };
    } catch (error) {
        console.error('Error getting customer data from storage:', error);
        return null;
    }
}

function getPurchaseDataFromPayment(paymentData) {
    try {
        // Determine purchase value and content based on the payment
        let value = 0;
        let contentName = '';

        // Check current page to determine purchase type
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/pagamento')) {
            value = 27.30; // Base shipping fee
            contentName = 'Uber Sticker Shipping Fee';
            
            // Check if camera was selected
            const cameraSelected = localStorage.getItem('cameraSelected') === 'true';
            if (cameraSelected) {
                value = 107.20; // Base + camera fee
                contentName = 'Uber Sticker + Dashcam Bundle';
            }
        } else if (currentPath.includes('/finalizar')) {
            value = 82.10; // Installation fee
            contentName = 'Uber Sticker Installation Fee';
        }

        return {
            value: value,
            content_name: contentName,
            payment_id: paymentData.payment_id || ''
        };
    } catch (error) {
        console.error('Error getting purchase data:', error);
        return null;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePaymentTracking);
} else {
    initializePaymentTracking();
}