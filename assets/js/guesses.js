const apiUrl = "https://baby-reveal.herokuapp.com";

const loadGuesses = async () => {
    const guessesDiv = document.querySelector(".guesses");

    const response = await fetch(`${apiUrl}/guesses`);
    const data = await response.json();

    if (response.status !== 200) {
        guessesDiv.innerHTML = "Não foi possível carregar a lista de palpites";
        return;
    }

    guessesDiv.innerHTML = ""

    Object.values(data).map((g) => {
        guessesDiv.innerHTML += `<p>${g.name} acha que é ${g.gender == 'male' ? 'menino' : 'menina'}</p>`;
    });

    setTimeout(() => {
        loadGuesses();
    }, 5000);
};

window.onload = () => {
    loadGuesses();
};
