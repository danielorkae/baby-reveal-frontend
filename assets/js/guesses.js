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

    const boyElement = '<span class="boy">menino</span>'
    const girlElement = '<span class="girl">menina</span>'

    Object.values(data).map((g) => {
        console.log(g)
        guessesDiv.innerHTML += `<p>${g.name} acha que é ${g.guess == 'male' ? boyElement : girlElement}</p>`;
    });

    setTimeout(() => {
        loadGuesses();
    }, 5000);
};

window.onload = () => {
    loadGuesses();
};
