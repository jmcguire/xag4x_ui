$(document).ready(function() {

    $('#board').xinc_board({
        show_coords: false,
        this_player: 'player_1',
        submit_link: '#submit'
    },{
        player_1: {
            name: "Archie",
            color: "red",
            armies: [
                { at: [3,2], status: "", unit_id: "1-1" }
            ],
            settlers: [
                { at: [0,3], status: "", unit_id: "1-1" }
            ],
            cities: [
                { at: [1,1], status: "", unit_id: "1-1" }
            ],
        },
        player_2: {
            name: "Betty",
            color: "blue",
            armies: [
                { at: [3,7], status: "", unit_id: "2-1" }
            ],
            settlers: [
                { at: [2,8], status: "", unit_id: "2-1" }
            ],
            cities: [
                { at: [3,9], status: "", unit_id: "2-1" }
            ],
        },
        player_3: {
            name: "Veronica",
            color: "gold",
            armies: [
                { at: [7,5], status: "", unit_id: "3-1" }
            ],
            settlers: [
                { at: [8,7], status: "", unit_id: "3-1" }
            ],
            cities: [
                { at: [9,5], status: "", unit_id: "3-1" }
            ],
        }
    });

});