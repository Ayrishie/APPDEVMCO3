document.addEventListener("DOMContentLoaded", function () {
    const editDescriptionButton = document.getElementById("edit-description-button");
    const saveDescriptionButton = document.getElementById("save-description-button");
    const userDescription = document.getElementById("user-description");
    const editDescriptionTextarea = document.getElementById("edit-description");
    const profilePictureUpload = document.getElementById("profile-picture-upload");
    const profileImage = document.querySelector(".profile-image img");
    const navbarUserImage = document.querySelector(".user-image");
    const viewProfileButton = document.getElementById("view-profile-button");


    // 1. Allow users to edit the description and display the change on the screen
    if ($("#edit-description-button").length) {
        editDescriptionButton.addEventListener("click", function () {
            userDescription.style.display = "none";
            editDescriptionTextarea.style.display = "block";
            editDescriptionTextarea.removeAttribute("readonly"); // Enable text input
            saveDescriptionButton.style.display = "block";
            editDescriptionTextarea.value = userDescription.textContent.replace("Description: ", "");
        });

        saveDescriptionButton.addEventListener("click", function () {
            userDescription.style.display = "block";
            editDescriptionTextarea.style.display = "none";
            editDescriptionTextarea.setAttribute("readonly", "readonly");
            saveDescriptionButton.style.display = "none";
            const editedDescription = editDescriptionTextarea.value.trim();
            userDescription.textContent = "Description: " + (editedDescription !== "" ? editedDescription : "No description available");

            document.getElementById("profile-update-form").submit();
            window.location.reload(true);
        });
    }

    // 2. Update the photos in the profile and header/navbar when a file is chosen
    profilePictureUpload.addEventListener("change", function () {
        const file = profilePictureUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                if (profileImage) {
                   profileImage.src = imageUrl; // Update profile image if it exists
                }
                navbarUserImage.src = imageUrl; // Update navbar user image
                console.log("Profile picture updated:", imageUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Only display "No file chosen" if Choose File button was clicked but no photo was chosen
    profilePictureUpload.addEventListener("click", function () {
        profilePictureUpload.value = ""; // Clear the file input selection
    });

    $(".delete-button").on("click", function(){
        $.ajax({
            url: "/profile/:email/deleteAccount",
            method: "DELETE"
        }).done(() => {
            window.location.href = "/";
        });
    });

});