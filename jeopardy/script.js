let rows = 5;
let cols = 5;

let editMode = false;

let teams = [];

let currentQuestion = null;

let board = {
  categories: [],
};

let finalJeopardy = {
  category: "",
  question: "",
};

createBoard(rows, cols);

function createBoard(r, c) {
  rows = r;
  cols = c;

  board.categories = [];

  for (let x = 0; x < c; x++) {
    let category = {
      name: "Category " + (x + 1),

      questions: [],
    };

    for (let y = 0; y < r; y++) {
      category.questions.push({
        value: (y + 1) * 100,

        question: "",
        answer: "",

        used: false,

        dailyDouble: false,
      });
    }

    board.categories.push(category);
  }

  renderBoard();
}

function resizeBoard() {
  createBoard(parseInt(rowsInput.value), parseInt(colsInput.value));
}

function toggleEdit() {
  editMode = !editMode;

  document.body.classList.toggle("editing", editMode);

  document.getElementById("finalEditor").style.display = editMode
    ? "block"
    : "none";

  renderBoard();
}

function renderBoard() {
  board.style = "";

  const boardDiv = document.getElementById("board");

  boardDiv.innerHTML = "";

  boardDiv.style.gridTemplateColumns = `repeat(${cols},1fr)`;

  board.categories.forEach((cat, c) => {
    const d = document.createElement("div");

    d.className = "category";

    if (editMode) {
      d.innerHTML = `
                <input
                    value="${cat.name}">
            `;

      d.querySelector("input").oninput = (e) => {
        cat.name = e.target.value;
      };
    } else {
      d.innerText = cat.name;
    }

    boardDiv.appendChild(d);
  });

  for (let r = 0; r < rows; r++) {
    board.categories.forEach((cat, c) => {
      const q = cat.questions[r];

      const d = document.createElement("div");

      d.className = "cell";

      if (q.used) d.classList.add("used");

      if (editMode) {
        d.innerHTML = `

                Value:
                <input
                    type="number"
                    value="${q.value}">

                <br>

                Daily Double:
                <input
                    type="checkbox"
                    ${q.dailyDouble ? "checked" : ""}>

                <br>

                Question:
                <textarea></textarea>

                <br>

                Answer:
                <textarea></textarea>
                `;

        const inputs = d.querySelectorAll("input,textarea");

        inputs[0].oninput = (e) => (q.value = parseInt(e.target.value) || 0);

        inputs[1].onchange = (e) => (q.dailyDouble = e.target.checked);

        inputs[2].value = q.question;

        inputs[2].oninput = (e) => (q.question = e.target.value);

        inputs[3].value = q.answer;

        inputs[3].oninput = (e) => (q.answer = e.target.value);
      } else {
        d.innerText = q.used ? "" : "$" + q.value;

        d.onclick = () => {
          if (!q.used) openQuestion(q);
        };
      }

      boardDiv.appendChild(d);
    });
  }

  finalJeopardy.category = finalCategoryInput.value;

  finalJeopardy.question = finalQuestionInput.value;
}

function openQuestion(q) {
  currentQuestion = q;

  popup.style.display = "flex";

  popupValue.innerText = "$" + q.value;

  popupQuestion.innerText = q.question;

  popupAnswer.innerText = q.answer;

  answerArea.style.display = "none";

  dailyDoubleText.innerText = q.dailyDouble ? "★ DAILY DOUBLE ★" : "";
}

function showAnswer() {
  answerArea.style.display = "block";
}

function closePopup() {
  popup.style.display = "none";

  currentQuestion.used = true;

  renderBoard();
}

/* TEAMS */

function addTeam() {
  if (!teamInput.value) return;

  teams.push({
    name: teamInput.value,

    score: 0,
  });

  teamInput.value = "";

  renderTeams();
}

function renderTeams() {
  const div = document.getElementById("teams");

  div.innerHTML = "";

  teams.forEach((team) => {
    const card = document.createElement("div");

    card.className = "team";

    card.innerHTML = `
            <b>${team.name}</b>

            <br>

            Score:

            <input
                type="number"
                value="${team.score}">
        `;

    card.querySelector("input").oninput = (e) => {
      team.score = parseInt(e.target.value) || 0;
    };

    div.appendChild(card);
  });
}

/* FINAL JEOPARDY */

function openFinalJeopardy() {
  finalJeopardy.category = finalCategoryInput.value;

  finalJeopardy.question = finalQuestionInput.value;

  finalCategoryDisplay.innerText = finalJeopardy.category;

  finalQuestionDisplay.innerText = finalJeopardy.question;

  finalQuestionArea.style.display = "none";

  wagerArea.innerHTML = "";

  finalPopup.style.display = "flex";
}

function revealFinalQuestion() {
  finalQuestionArea.style.display = "block";
}

function showWagers() {
  wagerArea.innerHTML = "";

  teams.forEach((team) => {
    const div = document.createElement("div");

    div.className = "finalTeam";

    div.innerHTML = `

            <b>${team.name}</b>

            <br>

            Wager:

            <input
                class="wager"
                type="number"
                value="0">

            Correct?

            <input
                class="correct"
                type="checkbox">

            <button>
                Apply
            </button>
        `;

    div.querySelector("button").onclick = () => {
      const wager = parseInt(div.querySelector(".wager").value) || 0;

      const correct = div.querySelector(".correct").checked;

      if (correct) team.score += wager;
      else team.score -= wager;

      renderTeams();

      div.style.opacity = ".5";
    };

    wagerArea.appendChild(div);
  });
}

function closeFinal() {
  finalPopup.style.display = "none";
}

/* EXPORT */

function exportBoard() {
  finalJeopardy.category = finalCategoryInput.value;

  finalJeopardy.question = finalQuestionInput.value;

  const data = {
    rows,
    cols,

    board,

    teams,

    finalJeopardy,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "text/plain",
  });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "jeopardy.txt";

  a.click();
}

/* IMPORT */

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const data = JSON.parse(reader.result);

    rows = data.rows;

    cols = data.cols;

    board = data.board;

    teams = data.teams || [];

    finalJeopardy = data.finalJeopardy || {
      category: "",
      question: "",
    };

    rowsInput.value = rows;

    colsInput.value = cols;

    finalCategoryInput.value = finalJeopardy.category;

    finalQuestionInput.value = finalJeopardy.question;

    renderBoard();
    renderTeams();
  };

  reader.readAsText(file);
});

renderTeams();
