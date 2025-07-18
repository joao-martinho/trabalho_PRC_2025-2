from flask import Flask, request
import socket

app = Flask(__name__)

TCP_HOST = 'larc.furb.br'
TCP_PORT = 1012
UDP_PORT = 1011

def tcp_request(message):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.connect((TCP_HOST, TCP_PORT))
            sock.sendall((message + "\r\n").encode())
            response = sock.recv(4096)
            return response.decode()
    except Exception as e:
        return f"Erro TCP: {str(e)}"

def udp_send(message):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.sendto((message + "\r\n").encode(), (TCP_HOST, UDP_PORT))
            return "Mensagem enviada com sucesso"
    except Exception as e:
        return f"Erro UDP: {str(e)}"

@app.route('/get-users')
def get_users():
    user = request.args.get('user')
    password = request.args.get('password')
    msg = f"GET USERS {user}:{password}"
    return tcp_request(msg)

@app.route('/get-message')
def get_message():
    user = request.args.get('user')
    password = request.args.get('password')
    msg = f"GET MESSAGE {user}:{password}"
    return tcp_request(msg)

@app.route('/send-message')
def send_message():
    from_id = request.args.get('from')
    password = request.args.get('pass')
    to_id = request.args.get('to')
    msg_text = request.args.get('msg')
    msg = f"SEND MESSAGE {from_id}:{password}:{to_id}:{msg_text}"
    return udp_send(msg)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000)
