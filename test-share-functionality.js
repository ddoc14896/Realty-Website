// Test Share Functionality
// Run this in browser console on property pages to test share functionality

async function testShareFunctionality() {
  console.log('Testing Share Functionality...');
  
  // Test 1: Check if share buttons exist
  const shareButtons = document.querySelectorAll('button[title="Share this property"]');
  console.log(`Found ${shareButtons.length} share button(s)`);
  
  if (shareButtons.length === 0) {
    console.error('❌ No share buttons found!');
    return false;
  }
  
  // Test 2: Check if buttons have click handlers
  let hasClickHandler = false;
  shareButtons.forEach((button, index) => {
    const events = getEventListeners ? getEventListeners(button) : null;
    if (events && events.click) {
      hasClickHandler = true;
      console.log(`✅ Share button ${index + 1} has click handler`);
    }
  });
  
  if (!hasClickHandler) {
    console.log('⚠️  Cannot detect click handlers (this is normal in production)');
  }
  
  // Test 3: Check if Web Share API or Clipboard API is supported
  const webShareSupported = !!navigator.share;
  const clipboardSupported = !!navigator.clipboard;
  
  console.log(`Web Share API supported: ${webShareSupported ? '✅' : '❌'}`);
  console.log(`Clipboard API supported: ${clipboardSupported ? '✅' : '❌'}`);
  
  if (!webShareSupported && !clipboardSupported) {
    console.error('❌ Neither Web Share API nor Clipboard API is supported!');
    return false;
  }
  
  // Test 4: Generate expected share data
  const propertyTitle = document.querySelector('h1')?.textContent || 'Property';
  const currentUrl = window.location.href;
  
  console.log('Expected share data:');
  console.log(`- Title: ${propertyTitle}`);
  console.log(`- URL: ${currentUrl}`);
  
  // Test 5: Try to click a share button (if available)
  if (shareButtons.length > 0) {
    console.log('You can now manually click a share button to test the functionality');
    
    // Highlight share buttons for easy identification
    shareButtons.forEach((button, index) => {
      button.style.border = '2px solid red';
      button.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';
      setTimeout(() => {
        button.style.border = '';
        button.style.boxShadow = '';
      }, 3000);
    });
  }
  
  console.log('✅ Share functionality test completed successfully!');
  return true;
}

// Auto-run the test
testShareFunctionality();