(function($) {

$.fn.xinc_board = function(options, placements) {

    var opts = $.extend({}, $.fn.xinc_board.opts_defaults, options);

    var selected_cell = new Object();

    create_board($(this), opts.height, opts.width);

    opts.show_coords ? $(".coords").show() : $(".coords").hide();

    /* place each unit, and give it its actions */
    for (var player_i in placements) {
        var player = placements[player_i];
        var action_allowed = player_i == opts.this_player ? 1 : 0;
        
        $.each(player.armies, function(player_id, piece) {
            var i = piece.at[0];
            var j = piece.at[1];

            var cell = $("#cell_" + i + "-" + j);
            draw_thing(cell, "army " + player.color);

            if (action_allowed) {
                var select_actions = get_select_actions(cell);
                var move_actions = get_move_actions(cell);
                /* every selectable cell gets two functions attached to it, one if it is selected,
                   and another if it is deselected, which cleans up. */
                cell.data('select', function(){
                    select_actions.select();
                    move_actions.select();
                });
                cell.data('deselect', function(){
                    select_actions.deselect();
                    move_actions.deselect();
                });

                cell.click(function(){
                    if ($(this).hasClass("selected")) {
                        $(this).data('deselect')();
                    } else {
                        $('.selected').each(function(){ $(this).data('deselect')() });
                        $(this).data('select')();
                    }
                });
            }
        });
        
        $.each(player.settlers, function(player_id, piece) {
            var i = piece.at[0];
            var j = piece.at[1];

            var cell = $("#cell_" + i + "-" + j);
            draw_thing(cell, "settler " + player.color);

            if (action_allowed) {
                var select_actions = get_select_actions(cell);
                var move_actions = get_move_actions(cell);
                var settle_actions = get_settle_actions(cell);
                
                /* every selectable cell gets two functions attached to it, one if it is selected,
                   and another if it is deselected, which cleans up. */
                cell.data('select', function(){
                    select_actions.select();
                    move_actions.select();
                    settle_actions.select();
                });
                cell.data('deselect', function(){
                    select_actions.deselect();
                    move_actions.deselect();
                    settle_actions.deselect();
                });
                
                cell.click(function(){
                    if ($(this).hasClass("selected")) {
                        $(this).data('deselect')();
                    } else {
                        $('.selected').each(function(){ $(this).data('deselect')() });
                        $(this).data('select')();
                    }
                });
            }
        });
        
        $.each(player.cities, function(player_id, piece) {
            var i = piece.at[0];
            var j = piece.at[1];
            
            var cell = $("#cell_" + i + "-" + j);
            draw_thing(cell, "city " + player.color);
            
            if (0) { /* check if under construction */
                ; /* no actions are allowed */
            } else if (action_allowed) {
                var select_actions = get_select_actions(cell);
                var build_actions = get_build_actions(cell);
                
                /* every selectable cell gets two functions attached to it, one if it is selected,
                   and another if it is deselected, which cleans up. */
                cell.data('select', function(){
                    select_actions.select();
                    build_actions.select();
                });
                cell.data('deselect', function(){
                    select_actions.deselect();
                    build_actions.deselect();
                });
                
                cell.click(function(){
                    if ($(this).hasClass("selected")) {
                        $(this).data('deselect')();
                    } else {
                        $('.selected').each(function(){ $(this).data('deselect')() });
                        $(this).data('select')();
                    }
                });
            }
        });
    }

    /* 
     * Drawing stuff on the screen
     *
     */

    /* build an empty board from a blank table */
    function create_board(table, height, width){
        for (i=0; i<height; i++) {
            var new_row = $("<tr>");
            for (j=0; j<width; j++) {
                var new_cell = $("<td>")
                new_cell.attr("id", "cell_" + i + "-" + j);
                /* new_cell.html(opts.show_coords ? i+","+j : "&nbsp;"); */
                new_cell.html('<span class="coords">'+i+','+j+'</span>');
                new_row.append(new_cell);
            }
            table.append(new_row);
        }
    }

    /* general function to place something on a tile */
    function draw_thing(cell, classes) {
        cell.removeClass();
        cell.addClass("icon " + classes)
    }

    /* 
     * Our actions for each tile
     *
     */

    /* make the cell "glow", or some other look-at-me effect */
    function get_select_actions(cell) {
        var select_fn = function(){
            cell.addClass("selected");
        }
        var deselect_fn = function(){
            cell.removeClass("selected");
        }
        return { select: select_fn, deselect: deselect_fn };
    }

    function get_move_actions(cell) {
        /* place arrow images, taking walls into account */
        /* give each arrow image a click function, the chooses it, and deselects the tile */
        /* add something like $(this).data("action", "MOVE UP"), then we later 
            $("unit").each( function(u){ u.data("action") }); */

        var select_fn = function(){
            ;
        }

        var deselect_fn = function(){
            ;
        }

        return { select: select_fn, deselect: deselect_fn };
    }

    function get_settle_actions(cell) {
        /* show the "city" icon, make it selectable */
        var img = $('<img src="images/transparent.png" class="mini-icon mini-city" alt="build a city" title="build a city" \>');

        var select_fn = function(){
            cell.append(img);

            /* place the image within the cell */
            var cell_offset = cell.offset();
            var top = cell_offset.top + opts.cell_size - opts.min_icon_margin - img.height();
            var left = cell_offset.left + opts.cell_size / 2 - img.width() / 2;
            img.offset({ top: top, left: left });
        }

        var deselect_fn = function(){
            img.remove();
        }

        return { select: select_fn, deselect: deselect_fn };
    }

    function get_build_actions(cell) {
        /* show the "army" and "settler" icons */
        var img_settler = $('<img src="images/transparent.png" class="mini-icon mini-settler" alt="build a settler" title="build a city" \>');
        var img_army = $('<img src="images/transparent.png" class="mini-icon mini-army" alt="build an army" title="build a city" \>');

        var select_fn = function(){
            cell.append(img_army);
            cell.append(img_settler);

            /* place the images within the cell */
            var cell_offset = cell.offset();
            var top = cell_offset.top + opts.cell_size - opts.min_icon_margin - img_army.height();
            var left1 = cell_offset.left + opts.min_icon_margin;
            var left2 = cell_offset.left + opts.cell_size - img_army.width() - opts.min_icon_margin;
            img_army.offset({ top: top, left: left1 });
            img_settler.offset({ top: top, left: left2 });
        }

        var deselect_fn = function(){
            img_army.remove();
            img_settler.remove();
        }

        return { select: select_fn, deselect: deselect_fn };
    }

};

$.fn.xinc_board.opts_defaults = {
    height: 10,
    width: 10,
    cell_size: 75, /* the height and width (in pixels) of the cell. right now this is integrated
                      tightly with the images and CSS, so changing just this won't affect much */
    min_icon_margin: 5, /* the margin between the cell border and any mini icons */
    show_coords: false,
    this_player: "" /* the id of who is playing */
};

})(jQuery);