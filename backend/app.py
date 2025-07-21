from flask import Flask, request, render_template, session, redirect, url_for
import socket, re

app = Flask(__name__)
app.secret_key = 'test'

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
            return "Mensagem enviada com sucesso!"
    except Exception as e:
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

@app.route('/get-users')
def get_users():
    if 'user_id' not in session: return 'Erro: Usuário não autenticado.', 401
    
    msg = f"GET USERS {session['user_id']}:{session['password']}"
    return tcp_request(msg)

@app.route('/get-message')
def get_message():
    if 'user_id' not in session: return 'Erro: Usuário não autenticado.', 401
    
    msg = f"GET MESSAGE {session['user_id']}:{session['password']}"
    return tcp_request(msg)

@app.route('/send-message')
def send_message():
    if 'user_id' not in session: return 'Erro: Usuário não autenticado.', 401
    
    to_id = request.args.get('to_id')
    msg_text = request.args.get('msg_text')
    msg = f"SEND MESSAGE {session['user_id']}:{session['password']}:{to_id}:{msg_text}"
    return udp_send(msg)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
