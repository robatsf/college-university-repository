document.addEventListener('DOMContentLoaded', function() {
    // Find the page-actions container for the Add Student button
    const addButtonContainer = document.querySelector('.page-actions');
    
    if (addButtonContainer) {
        let importUrl = null;
        
        // Look for the alert message containing the import URL
        const alertMessages = document.querySelectorAll('.alert-info');
        
        alertMessages.forEach(function(alert) {
            if (alert.textContent.includes('EXCEL_IMPORT_URL:')) {
                importUrl = alert.textContent.split('EXCEL_IMPORT_URL:')[1].trim();
                alert.style.display = 'none';
            }
        });
        
        if (importUrl) {
            // Create a hidden file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xlsx, .xls';
            fileInput.style.display = 'none';
            fileInput.id = 'excel-file-input';
            document.body.appendChild(fileInput);
            
            // Create the Import from Excel button with Bootstrap styling to match the Add Student button
            const importButton = document.createElement('a');
            importButton.href = '#';
            importButton.className = 'btn btn-outline-primary me-2'; // Bootstrap classes
            importButton.innerHTML = '<i class="fa fa-file-excel"></i> &nbsp; Import from Excel'; // Match icon style
            
            // Add click event to the button to trigger file input
            importButton.addEventListener('click', function(e) {
                e.preventDefault();
                fileInput.click();
            });
            
            // Add change event to the file input to handle file selection
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    uploadExcelFile(this.files[0], importUrl);
                }
            });
            
            // Insert the button before the Add Student button
            const addStudentButton = addButtonContainer.querySelector('a.btn');
            if (addStudentButton) {
                // Insert before the Add Student button
                addButtonContainer.insertBefore(importButton, addStudentButton);
            } else {
                // Fallback: just append to the container
                addButtonContainer.appendChild(importButton);
            }
        }
    }
    
    // Function to handle file upload
    function uploadExcelFile(file, url) {
        // Create a loading indicator with Bootstrap styling
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'excel-upload-loading';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '0';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.width = '100%';
        loadingIndicator.style.height = '100%';
        loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.justifyContent = 'center';
        loadingIndicator.style.alignItems = 'center';
        loadingIndicator.style.zIndex = '9999';
        
        const loadingText = document.createElement('div');
        loadingText.textContent = 'Uploading and processing Excel file...';
        loadingText.style.color = 'white';
        loadingText.style.padding = '20px';
        loadingText.style.backgroundColor = '#333';
        loadingText.style.borderRadius = '5px';
        
        loadingIndicator.appendChild(loadingText);
        document.body.appendChild(loadingIndicator);
        
        // Create FormData and append the file
        const formData = new FormData();
        formData.append('excel_file', file);
        
        // Add CSRF token
        const csrfToken = getCsrfToken();
        
        // Send the file to the server
        fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrfToken
            },
            credentials: 'same-origin'
        })
        .then(response => {
            // Remove loading indicator
            document.body.removeChild(loadingIndicator);
            
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.text().then(html => {
                    // If there was an error, display the form with errors
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    
                    // Check if there are form errors
                    const formErrors = tempDiv.querySelector('.errorlist');
                    if (formErrors) {
                        // Display error message
                        alert('Error: ' + formErrors.textContent);
                    } else {
                        // Redirect to the student list
                        window.location.href = window.location.href;
                    }
                });
            }
        })
        .catch(error => {
            // Remove loading indicator
            document.body.removeChild(loadingIndicator);
            
            // Display error message
            alert('Error uploading file: ' + error.message);
        });
    }
    
    // Function to get CSRF token from cookies
    function getCsrfToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 'csrftoken='.length) === 'csrftoken=') {
                    cookieValue = decodeURIComponent(cookie.substring('csrftoken='.length));
                    break;
                }
            }
        }
        return cookieValue;
    }
});