$(document).ready(function() {
    console.log("✅ DOM fully loaded and jQuery script running...");

    // Listen for changes on the role input element
    $(document).on('change', '#id_role', function() {
        var selectedRole = $(this).val();
        console.log("🔄 Role changed, value:", selectedRole);

        // For teachers: show the select2 control and hide any text input
        if (selectedRole === 'teacher') {
            // Hide any custom department text input and clear its value
            $('#id_department_input').hide().val('');
        
            // Show the original select element
            $('#id_department_select').show();
            // Use siblings() to show the associated Select2 container
            $('#id_department_select').siblings('.select2-container').show();
        }
         
        // For department heads: use a text input for department name
        else if (selectedRole === 'department_head') {
            // Hide the Select2 control (both the select and its container)
            $('#id_department_select').hide();
            $('#id_department_select').siblings('.select2-container').hide();

            // Create or show the text input for department name
            var $input = $('#id_department_input');
            if ($input.length === 0) {
                $input = $('<input>', {
                    type: 'text',
                    id: 'id_department_input',
                    name: 'department',
                    placeholder: 'Enter department name'
                }).css('display', 'block');
                // Insert the text input after the select element
                $('#id_department_select').after($input);
            } else {
                $input.show();
            }
        } 
        // For librarians: use a text input with a default value "Librarians"
        else if (selectedRole === 'librarian') {
            // Hide the Select2 control (both the select and its container)
            $('#id_department_select').hide();
            $('#id_department_select').next('.select2-container').hide();

            // Create or show the text input prefilled with "Librarians"
            var $input = $('#id_department_input');
            if ($input.length === 0) {
                $input = $('<input>', {
                    type: 'text',
                    id: 'id_department_input',
                    name: 'department',
                    value: 'Librarians',
                    readonly: true // Makes the input read-only
                }).css({
                    display: 'block',
                    backgroundColor: '#f3f3f3', // Optional: Light gray background to indicate it's disabled
                    cursor: 'not-allowed' // Optional: Change cursor to indicate it's non-editable
                });
            
                $('#id_department_select').after($input);
            } else {
                $input.val('Librarians').show();
            }
        }
    });

    // Trigger a change on page load to ensure the correct field is displayed
    $('#id_role').trigger('change');
});
