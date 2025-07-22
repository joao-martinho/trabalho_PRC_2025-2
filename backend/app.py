from flask import Flask, request, jsonify
from flask_cors import CORS
import socket

app = Flask(__name__)
CORS(app)

HOST = 'larc.furb.br'
TCP_PORT = 1012
UDP_PORT = 1011

def tcp_request(message):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.connect((HOST, TCP_PORT))
            sock.sendall((message + "\r\n").encode())
            response = sock.recv(4096)
            return response.decode()
    except Exception as e:
        return f"Erro TCP: {str(e)}"

def udp_send(message):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.sendto((message + "\r\n").encode(), (HOST, UDP_PORT))
            return jsonify({"message": "Mensagem enviada com sucesso"})
    except Exception as e:
<<<<<<< HEAD
        return jsonify({"message": "Erro UDP: {str(e)}"})
=======
        return f"Erro UDP: {str(e)}"
  
  
@app.route('/')
def frontpage():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    else:
        return redirect(url_for('messages_dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        form_user_id = request.form['user_id']
        form_password = request.form['password']
        
        valid_user_id = re.fullmatch(r'\d{4}', form_user_id)
        valid_password = re.fullmatch(r'[a-z]{5}', form_password)

        if valid_user_id and valid_password:
            session['user_id'] = form_user_id
            session['password'] = form_password
            return redirect(url_for('messages_dashboard'))
        else:
            return render_template('login.html', error='Erro: Usuário ou senha inválidos.')

    return render_template('login.html')

@app.route('/messages', methods = ['GET', 'POST'])
def messages_dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        return redirect(url_for('send_message'))

    return render_template('messages.html', logged_user=session['user_id'])
>>>>>>> 07a4c485aa337154fd5af7da945a992870051b7b

@app.route('/get-users', methods=['POST'])
def get_users():
    user = request.json.get('user')
    password = request.json.get('password')
    msg = f"GET USERS {user}:{password}"
    raw_response = tcp_request(msg).replace('\r\n', '')

    parts = raw_response.strip().split(':')

    users = []
    for i in range(0, len(parts) - 2, 3):
        try:
            users.append({
                "id": parts[i],
                "name": parts[i + 1],
                "victories": int(parts[i + 2])
            })
        except (IndexError, ValueError):
            continue

    return jsonify({"users": users})

@app.route('/get-message', methods=['POST'])
def get_message():
    user = request.json.get('user')
    password = request.json.get('password')
    msg = f"GET MESSAGE {user}:{password}"
<<<<<<< HEAD
    response = tcp_request(msg).replace('\r\n', '')

    if response == ":":
        return jsonify({})

    id_str, message = response.split(':', 1)
    id_num = int(id_str)
    return jsonify({'id': id_num, 'message': message})
=======
>>>>>>> 07a4c485aa337154fd5af7da945a992870051b7b

@app.route('/send-message', methods=['POST'])
def send_message():
    from_id = request.json.get('user')
    password = request.json.get('password')
    to_id = request.json.get('to')
    msg_text = request.json.get('msg')
    msg = f"SEND MESSAGE {from_id}:{password}:{to_id}:{msg_text}"
    return udp_send(msg)

<<<<<<< HEAD
def obter_nome_usuario(mensagem, id_alvo) -> str:
    try:
        marcador = f"{id_alvo}:"
        index_id = mensagem.index(marcador)
        inicio_nome = index_id + len(marcador)
        fim_nome = mensagem.index(":", inicio_nome)
        return mensagem[inicio_nome:fim_nome]
    except ValueError:
        return 'n/a'

@app.route('/get-players', methods=['POST'])
def get_players():
    user = request.json.get('user')
    password = request.json.get('password')
    msg = f"GET PLAYERS {user}:{password}"
    raw_response = tcp_request(msg)
    users_message = tcp_request(f"GET USERS {user}:{password}").replace('\r\n', '')
    parts = raw_response.strip().split(':')

    users = []
    for i in range(0, len(parts) - 1, 2):
        try:
            users.append({
                "id": parts[i],
                "name": obter_nome_usuario(users_message, parts[i]),
                "state": int(parts[i + 1])
            })
        except (IndexError, ValueError):
            continue

    return jsonify({"players": users})

@app.route('/get-card', methods=['POST'])
def get_card():
    user = request.json.get('user')
    password = request.json.get('password')
    msg = f"GET CARD {user}:{password}"
    raw_response = tcp_request(msg).replace('\r\n', '')

    if raw_response == ":":
        return jsonify({"cards": []})
    parts = raw_response.strip().split(':')

    users = []
    for i in range(0, len(parts) - 1, 2):
        try:
            users.append({
                "card": parts[i],
                "suit": parts[i + 1]
            })
        except (IndexError, ValueError):
            continue

    return jsonify({"cards": users})

@app.route('/send-game', methods=['POST'])
def send_game():
    user = request.json.get('user')
    password = request.json.get('password')
    msg = request.json.get('msg')
    to_send_msg = f"SEND GAME {user}:{password}:{msg}"

    return udp_send(to_send_msg)
=======
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))
>>>>>>> 07a4c485aa337154fd5af7da945a992870051b7b

if __name__ == '__main__':
    app.run(port=3000)
