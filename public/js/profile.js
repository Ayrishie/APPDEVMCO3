document.addEventListener("DOMContentLoaded", function () {
    const editProfileButton = document.getElementById("edit-profile-button");
    const saveProfileButton = document.getElementById("save-profile-button");
    const userDescription = document.getElementById("user-description");
    const editDescriptionTextarea = document.getElementById("edit-description");
    const profilePictureUpload = document.getElementById("profile-picture-upload");
    const profileImage = document.querySelector(".profile-image img");
    const navbarUserImage = document.querySelector(".user-image");
    const viewProfileButton = document.getElementById("view-profile-button");

    // 1. Allow users to edit the profile description and display the change on the screen
    if ($("#edit-profile-button").length) {
        editProfileButton.addEventListener("click", function () {
            userDescription.style.display = "none";
            editProfileButton.style.display = "none";
            editDescriptionTextarea.style.display = "block";
            editDescriptionTextarea.removeAttribute("readonly"); // Enable text input
            saveProfileButton.style.display = "block";
            profilePictureUpload.style.display = "block";
            editDescriptionTextarea.value = userDescription.textContent.replace("Description: ", "");
        });

        saveProfileButton.addEventListener("click", function () {
            userDescription.style.display = "block";
            editProfileButton.style.display = "block";
            editDescriptionTextarea.style.display = "none";
            editDescriptionTextarea.setAttribute("readonly", "readonly");
            saveProfileButton.style.display = "none";
            profilePictureUpload.style.display = "none";
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
                    profileImage.src = imageUrl; // Update profile image
                }
                if (navbarUserImage) {
                    navbarUserImage.src = imageUrl; // Update navbar user image
                }
                console.log("Profile picture updated:", imageUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Only display "No file chosen" if Choose File button was clicked but no photo was chosen
    profilePictureUpload.addEventListener("click", function () {
        profilePictureUpload.value = ""; // Clear the file input selection
    });



    
    const deleteButton = $(".delete-button");
    const modal = $("#confirmationModal");
    const closeModal = $(".close");
    const confirmDelete = $("#confirmDelete");
    const cancelDelete = $("#cancelDelete");

    // When the user clicks the button, open the modal
    deleteButton.on("click", function (e) {
        e.preventDefault();
        modal.show();
    });

    // When the user clicks on <span> (x), close the modal
    closeModal.on("click", function () {
        modal.hide();
    });

    // When the user clicks confirm
    confirmDelete.on("click", function () {
        $.ajax({
            url: "/profile/:email/deleteAccount",
            method: "DELETE",
        }).done(() => {
            window.location.href = "/";
        });
    });

    // When the user clicks cancel
    cancelDelete.on("click", function () {
        modal.hide();
    });
});
