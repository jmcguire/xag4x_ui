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
            setup_army(piece, player.color, action_allowed);
        });
        
        $.each(player.settlers, function(player_id, piece) {
            setup_settler(piece, player.color, action_allowed);
        });
        
        $.each(player.cities, function(player_id, piece) {
            setup_city(piece, player.color, action_allowed);
        });
    }

    /*
     *
     * Setup each unit, for this player and otherwise.
     *   piece          - object, from the init, looks like { at: [3,2], status: "" }
     *   player_color   - string, matches up to a color defined in CSS
     *   action_allowed - boolean
     *   unit_type      - string, "settler", "army", or "city". matched up to a unit type in CSS.
     *   action_fns     - array of functions, of the get_*_actions from below
     */
     
    /* some shortcuts to the setup_unit function */
    function setup_army (piece, player_color, action_allowed) {
        setup_unit(piece, player.color, action_allowed, "army", [get_select_actions, get_move_actions] );
    }
    function setup_settler (piece, player_color, action_allowed) {
        setup_unit(piece, player.color, action_allowed, "settler", [get_select_actions, get_move_actions, get_settle_actions] );
    }
    function setup_city (piece, player_color, action_allowed) {
        setup_unit(piece, player.color, action_allowed, "city", [get_select_actions, get_build_actions] );
    }
    
    function setup_unit (piece, player_color, action_allowed, unit_type, action_fns) {
        var i = piece.at[0];
        var j = piece.at[1];

        var cell = $("#cell_" + i + "-" + j);
        draw_thing(cell, unit_type + ' ' + player_color);

        if (action_allowed) {
            var select_fns = [];
            var deselect_fns = [];
            
            for (i in action_fns) {
                var actions = action_fns[i](cell);
                select_fns.push(actions.select);
                deselect_fns.push(actions.deselect);
            }
            
            /* every selectable cell gets two functions attached to it, one if it is selected,
               and another if it is deselected, which cleans up. */
            /*alert($.dump(select_fns));*/
            cell.data('select', function(){
                for (i in select_fns) {
                    select_fns[i]();
                }
            });
            cell.data('deselect', function(){
                for (i in deselect_fns) {
                    deselect_fns[i]();
                }
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
     * Our action sets for each unit.
     *
     */

    /* make the unit "glow", or some other look-at-me effect */
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

    /* settle actions let a unit create a city */
    function get_settle_actions(cell) {
        var img_city = $('<img src="images/transparent.png" class="mini-icon mini-city" alt="build a city" title="build a city" \>');

        var select_fn = function(){
            cell.append(img_city);
            place_image_bottom_center(cell, img_city);
        }

        var deselect_fn = function(){
            img_city.remove();
        }

        return { select: select_fn, deselect: deselect_fn };
    }

    /* build actions let a unit create an army or a settler */
    function get_build_actions(cell) {
        var img_settler = $('<img src="images/transparent.png" class="mini-icon mini-settler" alt="build a settler" title="build a settler" \>');
        var img_army = $('<img src="images/transparent.png" class="mini-icon mini-army" alt="build an army" title="build an army" \>');

        var select_fn = function(){
            cell.append(img_army);
            cell.append(img_settler);
            place_image_bottom_right(cell, img_settler);
            place_image_bottom_left(cell, img_army);
        }

        var deselect_fn = function(){
            img_army.remove();
            img_settler.remove();
        }

        return { select: select_fn, deselect: deselect_fn };
    }

    /*
     * Place a mini-icon within the cell.
     *
     * These functions take in two jquery objects, a <td> cell, and an <img>. The img must have
     * already been placed (be visible in the cell, like append()'ed).
     *
     * Each function will move the img to the appropriate place within the cell.
     *
     * Note: There's no guarantee that mini-icons won't overlap.
     * Note: These functions take opts.min_icon_margin into account.
     */
    function place_image_bottom_left(cell, img) {
        var cell_offset = cell.offset();
        var top = cell_offset.top + opts.cell_size - opts.min_icon_margin - img.height();
        var left = cell_offset.left + opts.min_icon_margin;
        img.offset({ top: top, left: left });
    }
    function place_image_bottom_right(cell, img) {
        var cell_offset = cell.offset();
        var top = cell_offset.top + opts.cell_size - opts.min_icon_margin - img.height();
        var left = cell_offset.left + opts.cell_size - img.width() - opts.min_icon_margin;
        img.offset({ top: top, left: left });
    }
    function place_image_bottom_center(cell, img) {
        var cell_offset = cell.offset();
        var top = cell_offset.top + opts.cell_size - opts.min_icon_margin - img.height();
        var left = cell_offset.left + opts.cell_size / 2 - img.width() / 2;
        img.offset({ top: top, left: left });
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