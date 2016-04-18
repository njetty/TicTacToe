from flask import Flask, render_template, request, jsonify
from common import isWinner

app = Flask(__name__)

# def isWinner(brd, ltr):
#     # Given a board and a player's letter, this function returns True if that player has won.
#     return ((brd[6] == ltr and brd[7] == ltr and brd[8] == ltr) or  # across the top
#     (brd[3] == ltr and brd[4] == ltr and brd[5] == ltr) or  # across the middle
#     (brd[1] == ltr and brd[2] == ltr and brd[0] == ltr) or  # across the bottom
#     (brd[7] == ltr and brd[4] == ltr and brd[1] == ltr) or  # down the left side
#     (brd[8] == ltr and brd[5] == ltr and brd[2] == ltr) or  # down the middle
#     (brd[0] == ltr and brd[6] == ltr and brd[3] == ltr) or  # down the right side
#     (brd[6] == ltr and brd[4] == ltr and brd[2] == ltr) or  # diagonal
#     (brd[8] == ltr and brd[4] == ltr and brd[0] == ltr))


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api/v2/play', methods = ['POST'])
def post():
    # Get the parsed contents of the form data
    json_input = request.json
    player = json_input['player_piece']
    opponent = json_input['opponent_piece']
    inpboard = list()
    for elem in json_input['board']:
        inpboard.append(elem['value'])

    print('player'+player)
    print('opponent'+opponent)
    result = isWinner(inpboard,opponent)
    print('is winner completed')
    if result:
        status='lose'
    else:
        print('in else of iswinner')
        brdNonEmpty = False
        for i in range(len(inpboard)):
            if not inpboard[i]:
                json_input['board'][i]['value']=player
                inpboard[i]=player
                brdNonEmpty=True
                break
        if isWinner(inpboard,opponent):
            print('Opponent if')
            status='win'
        else:
            print('Opponent else')
            if brdNonEmpty:
                status='active'
            else:
                status='draw'
    json_output={'status':status,'data':json_input}
    #print(json_output)

    # Render template
    return jsonify(json_output)


if __name__ == '__main__':
    app.run()
