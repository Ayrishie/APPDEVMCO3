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

        function ms_to_12h_time(ms){
            const hours = ms / (60 * 60 * 1000);
            const minutes = (hours % Math.floor(hours)) * 60;
            const am_pm = hours < 12 ? "AM" : "PM";

            return (Math.floor(hours) > 12 ? Math.floor(hours) % 12 : Math.floor(hours)) + ":" + minutes + (minutes < 10 ? "0" : "") + " " + am_pm;
        }

        function generate_time_slots(){
            // Current time in milliseconds
            let current_time = new Date();
            current_time = (current_time.getHours() * 60 * 60 * 1000) + (current_time.getMinutes() * 60 * 1000);

            // 07:30 (27000000) to 19:30 (70200000) in milliseconds
            for(let i = 27000000; i < 70200000; i  +=  1800000){
                if(current_time > i)
                    continue;

                const interval = $("<option>" + ms_to_12h_time(i) + " – " + ms_to_12h_time(i + 1800000) + "</option>");

                $(".time-options").append(interval);
                interval.data("timeStart", i);
                interval.data("timeEnd", i + 1800000);
            }
        }

        function meron_bang_time_slots(){
            if($(".time-options").children().length === 0){
                $(".reservation-container").empty();
                $(".reservation-container").append($("<p>No slots available at this time. Please try again later during active hours (7:30 AM to 7:30 PM).</p>"));
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
                        seat.data("reservationTimeStart", reservation.reservationTimeStart);
                        seat.data("reservationTimeEnd", reservation.reservationTimeEnd);
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

                        $.ajax({
                            url: "/reservation/" + $(".building").attr("data-building-id") + "/akinBaTo",
                            async: false,
                            data: {
                                reservedBy: $(this).data("reservedBy")
                            }
                        }).done((sagot) => {
                            if(sagot.result === true){
                                $(".sapang-temp").empty();
                                $(".sapang-temp").append($("<button class='edit-button'>Edit</button>"));
                                $(".sapang-temp").css("display", "flex");
                            }
                        });

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
                        reservationDate: selected_seat.data("reservationDate"),
                        reservationTime: selected_seat.data("reservationTime"),
                        reservationTimeStart: selected_seat.data("reservationTimeStart"),
                        reservationTimeEnd: selected_seat.data("reservationTimeEnd"),
                        seatID: selected_seat.data("seatID")
                    },
                    method: "DELETE"
                }).done(() => {
                    selected_seat.removeClass("seat-selected");
                    generate_seats();
                }).fail(() => {
                    selected_seat.removeClass("seat-selected");
                    $(".temp").empty();
                    $(".temp").append($("<p>Deletion failed. Please make sure that you are at least 10 minutes of the actual reservation time.</p>"));
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
                    reservationTimeStart: $(".time-options").find(":selected").data("timeStart"),
                    reservationTimeEnd: $(".time-options").find(":selected").data("timeEnd"),
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

        $(document).on("click", ".edit-button", function(){
            const edit_button = $(".edit-button");

            if(!edit_button.hasClass("edit-active")) {
                edit_button.addClass("edit-active");
                edit_button.text("Save Edits");
                $(".sapang-temp").append("<p>Select new time slot:</p>")

                const select_wrapper = $("<div class='select-wrapper'></div>");
                select_wrapper.append($("<span class='dropdown-arrow'></span>"));
                select_wrapper.append($("<select class='time-options'></select>"));
                $(".sapang-temp").append(select_wrapper);

                $(".time-options").empty();
                generate_time_slots();
            } else{
                const selected_seat = $(".seats-container").find(".seat-selected");

                $.ajax({
                    url: "/reservation/" + $(".building").attr("data-building-id") + "/editReservation",
                    data: {
                        building: $(".building").text(),
                        reservedBy: selected_seat.data("reservedBy"),
                        reservationDate: selected_seat.data("reservationDate"),
                        reservationTime: selected_seat.data("reservationTime"),
                        reservationTimeStart: selected_seat.data("reservationTimeStart"),
                        reservationTimeEnd: selected_seat.data("reservationTimeEnd"),
                        seatID: selected_seat.data("seatID"),
                        newReservationTime: $(".sapang-temp .time-options").find(":selected").val(),
                        newReservationTimeStart: $(".sapang-temp .time-options").find(":selected").data("timeStart"),
                        newReservationTimeEnd: $(".sapang-temp .time-options").find(":selected").data("timeEnd")
                    },
                    method: "POST"
                }).done(() => {
                    edit_button.removeClass("edit-active");
                    $(".sapang-temp").empty();
                    generate_seats();
                }).fail(() => {
                    edit_button.removeClass("edit-active");
                    $(".sapang-temp").empty();
                    $(".sapang-temp").append("<p>Edit failed. Please try again.</p>")
                });
            }
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
            $(".seat-selected").removeClass("seat-selected");
            $(".reserve-button").prop("disabled", true);
            if ($(".delete-button").length)
                $(".delete-button").hide();
            $(".temp").empty();
            $(".sapang-temp").empty();
        });

        $(".time-options").on("change", function () {
            generate_seats();
            $(".seat-selected").removeClass("seat-selected");
            $(".reserve-button").prop("disabled", true);
            if ($(".delete-button").length)
                $(".delete-button").hide();
            $(".temp").empty();
            $(".sapang-temp").empty();
        });

        generate_dates();
        generate_time_slots();
        generate_seats();
        meron_bang_time_slots();
    });

});
    
