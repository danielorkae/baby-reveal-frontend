const apiUrl = "http://localhost:3000";
// const apiUrl = "https://baby-reveal.herokuapp.com";

const getReveal = async () => {
    const response = await fetch(`${apiUrl}/reveal`);

    const data = await response.json();

    if (response.status !== 200) {
        const endDate = data.error.meta.revealDate;
        setRemainingTime(endDate);
    }

    const revealBoy = document.querySelector(".timer-section__reveal--boy");
    const revealGirl = document.querySelector(".timer-section__reveal--girl");

    if (data.gender == "male") {
        revealBoy.setAttribute("style", "display: flex");
    }

    if (data.gender == "female") {
        revealGirl.setAttribute("style", "display: flex");
        console.log(revealGirl)
    }
};

const loadGuesses = async () => {
    const boysDiv = document.querySelector(".guesses-list-items--boy");
    const girlsDiv = document.querySelector(".guesses-list-items--girl");

    const response = await fetch(`${apiUrl}/guesses`);
    const data = await response.json();

    if (response.status !== 200) {
        boysDiv.innerHTML = "Não foi possível carregar a lista de palpites";
        girlsDiv.innerHTML = "Não foi possível carregar a lista de palpites";
        return;
    }

    const boys = Object.values(data).filter((v) => v.guess == "male");
    const girls = Object.values(data).filter((v) => v.guess == "female");

    boysDiv.innerHTML = "";
    girlsDiv.innerHTML = "";

    boys.map((g) => {
        boysDiv.innerHTML += `<p>${g.name}</p>`;
    });

    girls.map((g) => {
        girlsDiv.innerHTML += `<p>${g.name}</p>`;
    });

    setTimeout(() => {
        loadGuesses();
    }, 5000);
};

const guessFormSubmitHandler = async (event) => {
    event.preventDefault();
    const name = document.querySelector("[name=name]").value;
    const guess = document.querySelector("[name=guess]:checked").value;
    const data = {
        name,
        guess,
    };

    if (name.length === 0 || guess.length === 0) {
        alert("Preencha todos os campos");
        return;
    }

    const response = await fetch(`${apiUrl}/guesses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (response.status !== 200) {
        alert("Não foi possível salvar o palpite");
        return;
    }

    localStorage.setItem("guess", data);

    showGuessRegisteredMessage();
};

const showGuessRegisteredMessage = () => {
    if (localStorage.getItem("guess")) {
        document
            .querySelector("#guess-form")
            .setAttribute("style", "display: none");
        document
            .querySelector(".guess-registered")
            .setAttribute("style", "display: block");
    }
};

const setRemainingTime = (endDate) => {
    const timer = document.querySelector(".timer-box__timer");

    let now = Date.now();

    let diff = endDate - now;

    if (diff <= 0) {
        diff = 0;
    }

    let diffInHours = diff / 1000 / 60 / 60;

    let days = Math.floor(diffInHours / 24);
    let hours = Math.floor(diffInHours - days * 24);
    let minutes = Math.floor((diffInHours - (days * 24 + hours)) * 60);
    let seconds = Math.floor(
        (diffInHours - (days * 24 + hours + minutes / 60)) * 3600
    );

    hours = hours.toLocaleString("pt-BR", { minimumIntegerDigits: 2 });
    minutes = minutes.toLocaleString("pt-BR", { minimumIntegerDigits: 2 });
    seconds = seconds.toLocaleString("pt-BR", { minimumIntegerDigits: 2 });

    if (days > 0) {
        timer.innerHTML = `${days} dias`;
    } else {
        timer.innerHTML = `${hours}:${minutes}:${seconds} horas`;
    }

    setTimeout(() => {
        diff < 1000 * 60 ? getReveal() : setRemainingTime(endDate);
    }, 1000);
};

window.onload = () => {
    getReveal();
    loadGuesses();
    showGuessRegisteredMessage();
};
