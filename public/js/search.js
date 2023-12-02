$(function(){
    function format_date(date){
        return date.toLocaleString("en-us", {month: "long"}) + " " + date.getDate() + ", " + date.getFullYear();
    }

    function generate_dates(){
        for(let i = 0; i < 7; i++){
            let date = new Date();
            date.setDate(date.getDate() + i);

            $(".date-options").append($("<option>" + format_date(date) + "</option>").prop("value", format_date(date)));
        }
        console.log("Dates generated:", $(".date-options").html());
    }

    function generate_seats(){
        const seats_container = $(".seats-container");
        let reservations = [];
        seats_container.empty();

        console.log("AJAX Request URL for Reservations:", "/reservation/" + $(".building").attr("data-building-id") + "/getReservations");

        $.ajax({
            url: "/reservation/" + $(".building").attr("data-building-id") + "/getReservations",
            data: {
                building: $(".building").text(),
                reservationDate: $(".date-options").find(":selected").val(),
                reservationTime: $(".time-options").find(":selected").val()
            },
            success: function(data){
                console.log("Ajax success");
                for(let i = 0; i < data.length; i++)
                    reservations.push(data[i]);
            }
        }).done(() => {
            console.log("Reservations Data:", reservations);

            for (let i = 1; i <= 25; i++) {
                           
                const seat = $("<span class='seat'></span>");
                seats_container.append($("<span class='seat-wrapper'></span>").append(seat));
            
                const reservation = reservations.find(reservation => reservation.seatID === i);
                console.log("Seat ID:", i, "Reservation Data:", reservation);
            
                // Set the seat data correctly
                seat.text(i).data("seatID", i);
            
                if (reservation) {
                    seat.addClass("seat-reserved");
                    seat.data("reservedBy", reservation.reservedBy);
                    seat.data("reservationDate", reservation.reservationDate);
                    seat.data("reservationTime", reservation.reservationTime);
                }
                console.log("Seat Data:", seat.data());
            }
            
            

            $(".seat").on("click", function(){
                const temp = $(".temp");
                temp.empty();
                $(".seat-selected").removeClass("seat-selected");
                $(this).addClass("seat-selected");

                if(!$(this).hasClass("seat-reserved"))
                    $(".reserve-button").prop("disabled", false);
                else{
                    $(".reserve-button").prop("disabled", true);
                    temp.append($("<p></p>").text("reservedBy: " + $(this).data("reservedBy")));
                    temp.append($("<p></p>").text("reservationDate: " + $(this).data("reservationDate")));
                    temp.append($("<p></p>").text("reservationTime: " + $(this).data("reservationTime")));
                    temp.append($("<p></p>").text("seatID: " + $(this).data("seatID")));
                }
            });
        });
        console.log("Seats generated:");
        seats_container.find(".seat").each(function() {
        const seat = $(this);
        console.log("Seat ID:", seat.data("seatID"), "Reserved By:", seat.data("reservedBy"), "Reservation Date:", seat.data("reservationDate"), "Reservation Time:", seat.data("reservationTime"));
});
    }

    $(".reserve-button").on("click", function (event) {
        $(".reserve-button").prop("disabled", true);
        const selected_seat = $(".seats-container").find(".seat-selected");
    
        const isAnonymous = $(".reserve-anonymously-checkbox").is(":checked");
        const reservedBy = isAnonymous ? "Anonymous" : "email@dlsu.edu.ph";
    
        $.ajax({
            url: "/reservation/" + $(".building").attr("data-building-id"),
            data: {
                building: $(".building").text(),
                reservedBy: reservedBy,
                reservationDate: $(".date-options").find(":selected").val(),
                reservationTime: $(".time-options").find(":selected").val(),
                seatID: selected_seat.data("seatID"),
                isAnonymous: isAnonymous
            },
            type: "POST",
            complete: function () {
                $(".reserve-button").prop("disabled", true);
                selected_seat.blur();
                selected_seat.removeClass("seat-selected");
                generate_seats();
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

    $(".date-options").on("change", function(){
        console.log("Date Options Change Event");
        generate_seats();
    });

    $(".time-options").on("change", function(){
        console.log("Time Options Change Event");
        generate_seats();
    });


    
    generate_dates();
    generate_seats();


    
});