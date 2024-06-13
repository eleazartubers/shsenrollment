$(function(){
    $("#wizard").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        transitionEffectSpeed: 500,
        labels: {
            finish: "Submit",
            next: "Forward",
            previous: "Backward"
        },
        onFinished: function (event, currentIndex) {
            generatePDF();
        }
    });

    $('.wizard > .steps li a').click(function(){
        $(this).parent().addClass('checked');
        $(this).parent().prevAll().addClass('checked');
        $(this).parent().nextAll().removeClass('checked');
    });

    // Custom JQuery Step Button
    $('.forward').click(function(){
        $("#wizard").steps('next');
    });

    $('.backward').click(function(){
        $("#wizard").steps('previous');
    });

    // Select Dropdown
    $('html').click(function() {
        $('.select .dropdown').hide(); 
    });
    $('.select').click(function(event){
        event.stopPropagation();
    });
    $('.select .select-control').click(function(){
        $(this).parent().next().toggle();
    });
    $('.select .dropdown li').click(function(){
        $(this).parent().toggle();
        var text = $(this).attr('rel');
        $(this).parent().prev().find('div').text(text);

        // Update hidden input field value
        var fieldId = $(this).parent().data('field-id');
        $('#' + fieldId).val(text);
    });

    // Function to generate PDF
    async function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let firstName = $('#firstName').val();
        let middleName =$('#middleName').val();
        let lastName = $('#lastName').val();
        let email = $('#email').val();
        let phoneNumber = $('#phoneNumber').val();
        let age = $('#age').val();
        let gender = $("input[name='gender']:checked").val();
        let address = $('#address').val();
        let city = $('#city').val();
        let province = $('#province').val();
        let barangay = $('#barangay').val();
        let gradeLevel = $('#gradeLevel').val();
        let trackStrand = $('#trackStrand').val();
        let photoFile = $('#photoUpload')[0].files[0];

        // Set font and add title
        doc.setFontSize(22);
        doc.text("Student Enrollment Form", 105, 20, null, null, "center");

        // Draw a horizontal line
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);

        // Add photo in the upper right corner
        if (photoFile) {
            const photoDataUrl = await readFileAsDataURL(photoFile);
            doc.addImage(photoDataUrl, 'JPEG', 150, 30, 40, 40); // Adjust the size and position as needed
        }

        // Set font size for content
        doc.setFontSize(12);

        // Personal information section
        doc.text("Personal Information", 20, 45);
        doc.text("First Name: " + firstName, 20, 55);
        doc.text("Middle Name: " + middleName, 20, 65);
        doc.text("Last Name: " + lastName, 20, 75);
        doc.text("Email: " + email, 20, 85);
        doc.text("Phone Number: " + phoneNumber, 20, 95);
        doc.text("Age: " + age, 20, 105);
        doc.text("Gender: " + gender.charAt(0).toUpperCase() + gender.slice(1), 20, 115);

        // Address section
        doc.text("Address Information", 20, 125);
        doc.text("Address: " + address, 20, 135);
        doc.text("City: " + city, 20, 145);
        doc.text("Province: " + province, 20, 155);
        doc.text("Barangay: " + barangay, 20, 165);

        // Enrollment details section
        doc.text("Enrollment Details", 20, 175);
        doc.text("Grade Level: " + gradeLevel, 20, 185);
        doc.text("Track/Strand: " + trackStrand, 20, 195);

        // Create a Blob from the PDF
        const pdfBlob = doc.output('blob');

        // Create a URL for the Blob and open it in a new tab for preview
        const url = URL.createObjectURL(pdfBlob);
        window.open(url);

        // Reset the form and wizard
        resetForm();
    }

    // Function to reset the form and wizard
    function resetForm() {
        // Reset form fields
        $('#firstName').val('');
        $('#middleName').val('');
        $('#lastName').val('');
        $('#email').val('');
        $('#phoneNumber').val('');
        $('#age').val('');
        $("input[name='gender']").prop('checked', false);
        $('#address').val('');
        $('#city').val('');
        $('#province').val('');
        $('#barangay').val('');
        $('#gradeLevel').val('');
        $('#trackStrand').val('');
        $('#photoUpload').val('');

        // Reset dropdown displays
        $('.select .select-control').each(function() {
            $(this).text('Select');
        });

        // Reset wizard to the first step
        $("#wizard").steps('reset');

        // Remove the 'checked' class from all steps
        $('.wizard > .steps li').removeClass('checked');
    }

    // Helper function to read file as Data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
});
