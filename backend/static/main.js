var usersElement = document.getElementById('active-users');

function getUsers() {
    fetch('/get-users')
        .then(res => res.text())
        .then(text => {usersElement.innerText = text;})
        .catch(() => {usersElement.innerText = 'Erro ao buscar usuários.';});
}

setInterval(getUsers, 6000);
window.addEventListener('load', getUsers);

function getMessage() {
    fetch('/get-message')
        .then(res => res.text())
        .then(text => {
            document.getElementById('received-msg').innerText = text;
        })
        .catch(() => {usersElement.innerText = 'Erro ao buscar mensagem.';});
}

document.getElementById('send-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const toId = this.to_id.value;
    const msgText = this.msg_text.value;

    const url = `/send-message?to_id=${encodeURIComponent(toId)}&msg_text=${encodeURIComponent(msgText)}`;

    fetch(url)
        .then(res => res.text())
        .then(text => {
            document.getElementById('sent-msg').innerText = text;
            this.reset();
        })
        .catch(() => {usersElement.innerText = 'Erro ao enviar mensagem.';});
});

