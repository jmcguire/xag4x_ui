$(document).ready(function() {

    $('#board').xinc_board({
        show_coords: false,
        this_player: "player_1"
    },{
        player_1: {
            name: "Archie",
            color: "red",
            armies: [
                { at: [3,2], status: "" }
            ],
            settlers: [
                { at: [1,3], status: "" }
            ],
            cities: [
                { at: [1,1], status: "" }
            ],
        },
        player_2: {
            name: "Betty",
            color: "blue",
            armies: [
                { at: [3,7], status: "" }
            ],
            settlers: [
                { at: [2,8], status: "" }
            ],
            cities: [
                { at: [3,9], status: "" }
            ],
        },
        player_3: {
            name: "Veronica",
            color: "gold",
            armies: [
                { at: [7,5], status: "" }
            ],
            settlers: [
                { at: [8,7], status: "" }
            ],
            cities: [
                { at: [9,5], status: "" }
            ],
        }
    });

});