def isWinner(board, playChar):
    # Given a board and a player's letter, this function returns True if that player has won.
    return ((board[0] == playChar and board[1] == playChar and board[2] == playChar) or
            (board[3] == playChar and board[4] == playChar and board[5] == playChar) or
            (board[6] == playChar and board[7] == playChar and board[8] == playChar) or
            (board[0] == playChar and board[3] == playChar and board[6] == playChar) or
            (board[1] == playChar and board[4] == playChar and board[7] == playChar) or
            (board[2] == playChar and board[5] == playChar and board[8] == playChar) or
            (board[0] == playChar and board[4] == playChar and board[8] == playChar) or
            (board[2] == playChar and board[4] == playChar and board[6] == playChar))
