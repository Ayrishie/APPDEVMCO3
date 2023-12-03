$(document).ready(function () {

    $(function () {
        function format_date(date) {
            return date.toLocaleString("en-us", {month: "long"}) + " " + date.getDate() + ", " + date.getFullYear();
        }

        function generate_dates() {
            for (let i = 0; i < 7; i++) {
                let date = new Date();
                date.setDate(date.getDate() + i);

                $(".date-options").append($("<option>" + format_date(date) + "</option>").prop("value", format_date(date)));
            }
        }

        function generate_seats() {
            const seats_container = $(".seats-container");
            let reservations = [];
            seats_container.empty();
            console.log("Before Ajax Request");
            console.log("AJAX Request URL for Reservations:", "/reservation/" + $(".building").attr("data-building-id") + "/getReservations");
            $.ajax({
                url: "/reservation/" + $(".building").attr("data-building-id") + "/getReservations",
                data: {
                    building: $(".building").text(),
                    reservationDate: $(".date-options").find(":selected").val(),
                    reservationTime: $(".time-options").find(":selected").val()
                },
                success: function (data) {
                    for (let i = 0; i < data.length; i++)
                        reservations.push(data[i]);
                }
            }).done(() => {
                console.log("Ajax Request Successful");
                console.log("Reservations Data:", reservations);
                for (let i = 1; i <= 25; i++) {
                    const seat = $("<span class='seat'></span>");

                    seats_container.append($("<span class='seat-wrapper'></span>").append(seat));

                    const reservation = reservations.find(reservation => reservation.seatID === i);
                    seat.data("seatID", i).text(seat.data("seatID"));

                    if (reservation) {
                        seat.addClass("seat-reserved");
                        seat.data("reservationDate", reservation.reservationDate);
                        seat.data("reservationTime", reservation.reservationTime);
                        seat.data("reservedBy", reservation.reservedBy);
                        seat.data("isAnonymous", reservation.isAnonymous); // Set the isAnonymous attribute

                    } else {
                        seat.data("isAnonymous", false); // If the seat is not reserved, it's not anonymous

                    }

                }

                $(".seat").on("click", function () {
                    const temp = $(".temp");
                    temp.empty();
                    $(".seat-selected").removeClass("seat-selected");
                    $(this).addClass("seat-selected");

                    console.log("Seat Clicked. Is Reserved:", $(this).hasClass("seat-reserved"));

                    if (!$(this).hasClass("seat-reserved")) {
                        if ($(".delete-button").length)
                            $(".delete-button").hide();
                        $(".reserve-button").prop("disabled", false);
                    } else {
                        if ($(".delete-button").length)
                            $(".delete-button").show();
                        $(".reserve-button").prop("disabled", true);

                        console.log("Reserved By:", $(this).data("reservedBy"));
                        console.log("Is Anonymous:", $(this).data("isAnonymous"));

                        if ($(this).data("isAnonymous")) {
                            // Handle the case when the reservation is anonymous
                            console.log("Reserved Anonymously");
                            $(".temp").empty(); // Clear existing content
                            $(".temp").append($("<p>Reserved Anonymously</p>"));

                            // Add logic to show other details for anonymous reservations
                            $(".temp").append($("<p></p>").text("Reservation Date: " + $(this).data("reservationDate")));
                            $(".temp").append($("<p></p>").text("Reservation Time: " + $(this).data("reservationTime")));
                            $(".temp").append($("<p></p>").text("Seat Reserved: Seat " + $(this).data("seatID")));
                        } else {
                            // Handle the case when the reservation is not anonymous
                            console.log("Reserved By:", $(this).data("reservedBy"));

                            // Conditionally show or hide the user's email
                            if ($(this).data("isAnonymous")) {
                                temp.append($("<p>Reserved by: Anonymous</p>"));
                            } else {
                                temp.append($("<p>Reserved by: </p>").append($("<a>" + $(this).data("reservedBy") + "</a>").attr("href", "/profile/" + $(this).data("reservedBy"))));
                            }

                            temp.append($("<p></p>").text("Reservation date: " + $(this).data("reservationDate")));
                            temp.append($("<p></p>").text("Reservation time: " + $(this).data("reservationTime")));
                            temp.append($("<p></p>").text("Seat reserved: Seat " + $(this).data("seatID")));
                        }
                    }
                });
            });
            console.log("Seats generated:");
            seats_container.find(".seat").each(function () {
                const seat = $(this);
                console.log("Seat ID:", seat.data("seatID"), "Reserved By:", seat.data("reservedBy"), "Reservation Date:", seat.data("reservationDate"), "Reservation Time:", seat.data("reservationTime"));
            });
        }

        if ($(".delete-button").length)
            $(".delete-button").on("click", function () {
                const selected_seat = $(".seats-container").find(".seat-selected");
                $(".temp").empty();
                $(".delete-button").hide();

                $.ajax({
                    url: "/reservation/" + $(".building").attr("data-building-id") + "/deleteReservation",
                    data: {
                        building: $(".building").text(),
                        reservedBy: selected_seat.data("reservedBy"),
                        reservationDate: $(".date-options").find(":selected").val(),
                        reservationTime: $(".time-options").find(":selected").val(),
                        seatID: selected_seat.data("seatID")
                    },
                    method: "DELETE"
                }).done(() => {
                    selected_seat.blur();
                    selected_seat.removeClass("seat-selected");
                    generate_seats();
                });
            });

        $(".reserve-button").on("click", function (event) {
            $(".reserve-button").prop("disabled", true);
            const selected_seat = $(".seats-container").find(".seat-selected");

            console.log("Reserve button clicked");

            const isAnonymous = $(".reserve-anonymously-checkbox").is(":checked");
            console.log("Is Anonymous:", isAnonymous);

            $.ajax({
                data: {
                    building: $(".building").text(),
                    reservationDate: $(".date-options").find(":selected").val(),
                    reservationTime: $(".time-options").find(":selected").val(),
                    seatID: selected_seat.data("seatID"),
                    isAnonymous: isAnonymous
                },
                type: "POST",
                beforeSend: function () {
                    console.log("AJAX request sent");
                },
                complete: function () {
                    console.log("AJAX request complete");
                    $(".reserve-button").prop("disabled", true);
                    selected_seat.blur();
                    selected_seat.removeClass("seat-selected");
                    generate_seats();
                },
                success: function (data) {
                    console.log("AJAX request successful");
                    console.log("Data received:", data);
                },
                error: function (xhr, status, error) {
                    console.error("AJAX request failed:", status, error);
                }
            });
        });


        // Handle changes in the "Reserve anonymously" checkbox
        $(".reserve-anonymously-checkbox").on("change", function () {
            console.log("Checkbox state changed");
            if ($(this).prop("checked")) {
                console.log("Reserve anonymously checkbox checked");
            } else {
                console.log("Reserve anonymously checkbox unchecked");
            }
        });

        $(".date-options").on("change", function () {
            generate_seats();
        });

        $(".time-options").on("change", function () {
            generate_seats();
        });

        generate_dates();
        generate_seats();

    });

});
    
    