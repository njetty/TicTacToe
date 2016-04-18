var Player = function(piece, iconClass) {
    this.piece = piece;
    this.iconClass = iconClass;
};
var Board = function(boardSpaceSelector) {
    boardSpaces = $(boardSpaceSelector);
    enabled = false;
    getSpaceById = function(id) {
        return $($.grep(boardSpaces, function(e) {
            return e.id === id;
        })[0]);
    };
};
Board.prototype.startWith = function(humanPlayerArg, computerPlayerArg) {
    humanPlayer = humanPlayerArg;
    computerPlayer = computerPlayerArg;
};
Board.prototype.read = function() {
    var board_data = [];
    boardSpaces.each(function() {
        var space_data = {};
        space_data.id = this.id;
        space_data.value = $(this).prop('title');
        board_data.push(space_data);
    });
    return {
        player_piece: computerPlayer.piece,
        opponent_piece: humanPlayer.piece,
        board: board_data
    };
};
Board.prototype.write = function(data) {
    data.board.forEach(function(space) {
        dom_space = getSpaceById(space.id);
        dom_space.prop('title', space.value);
        if (space.winning_space === true) {
            dom_space.addClass('winning');
        }
        if (space.value == humanPlayer.piece) {
            dom_space.addClass('human').addClass(humanPlayer.iconClass);
        }
        if (space.value == computerPlayer.piece) {
            dom_space.addClass('computer').addClass(computerPlayer.iconClass);
        }
    });
};
Board.prototype.clear = function() {
    boardSpaces.prop('title', '').attr('class', 'fa');
};
Board.prototype.registerHumanClick = function(element) {
    dom_space = getSpaceById(element[0].id);
    if (enabled === true && dom_space.prop('title') === '') {
        dom_space.prop('title', humanPlayer.piece);
        dom_space.addClass('human').addClass(humanPlayer.iconClass);
        return true;
    }
    return false;
};
Board.prototype.registerHumanHover = function(element) {
    dom_space = getSpaceById(element[0].id);
    if (enabled === true && dom_space.prop('title') === '') {
        dom_space.addClass('hover').addClass(humanPlayer.iconClass);
    }
};
Board.prototype.clearHumanHover = function(element) {
    dom_space = getSpaceById(element[0].id);
    if (enabled === true && dom_space.prop('title') === '') {
        dom_space.removeClass('hover').removeClass(humanPlayer.iconClass);
    }
};
Board.prototype.disable = function() {
    enabled = false;
};
Board.prototype.enable = function() {
    enabled = true;
};
var Reporter = function(computerElement, humanElement, promptElement) {
    this.computerElement = $(computerElement);
    this.humanElement = $(humanElement);
    this.promptElement = $(promptElement);
};
Reporter.prototype.start = function(message) {
    this.humanElement.html('I\'ll start over.');
    this.computerElement.html('You start over.');
};
Reporter.prototype.updateStatus = function(status) {
    if (status == 'draw') {
        this.promptElement.html('It\'s a draw.');
    } else if (status == 'win') {
        this.promptElement.html('I win.');
    } else if (status == 'lose'){
		this.promptElement.html('You win.');
	} else {
        this.promptElement.html('Go.');
    }
};
Reporter.prototype.think = function() {
    this.promptElement.html('<i class="fa fa-cog fa-spin fa-2x"></i>');
};

function updateGame(board, reporter) {
    $.ajax({
        type: 'POST',
        url: '/api/v2/play',
        dataType: 'json',
        data: JSON.stringify(board.read()),
		contentType: "application/json; charset=utf-8",
        processData: false,
        beforeSend: function() {
            board.disable();
            reporter.think();
        },
        success: function(data, status, jqxhr) {
            board.write(data.data);
            reporter.updateStatus(data.status);
            if (data.status == 'active') {
                board.enable();
            }
        }
    });
}
$(document).ready(function() {
    x = new Player('x', 'fa-times');
    o = new Player('o', 'fa-circle-o');
    board = new Board('.space i');
    reporter = new Reporter('#start-computer p', '#start-human p', '#prompt');
    $('#start-human').click(function() {
        reporter.start();
        board.clear();
        board.startWith(x, o);
        reporter.updateStatus('active');
        board.enable();
    });
    $('#start-computer').click(function() {
        reporter.start();
        board.clear();
        board.startWith(o, x);
        updateGame(board, reporter);
    });
    $('.space').hover(function() {
        board.registerHumanHover($(this).children('i'));
    }, function() {
        board.clearHumanHover($(this).children('i'));
    });
    $('.space').click(function() {
        if (board.registerHumanClick($(this).children('i'))) {
            updateGame(board, reporter);
        }
    });
});