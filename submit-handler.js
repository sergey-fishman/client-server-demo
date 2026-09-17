document.getElementById("userForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Перед отправкой на сервер проверяем валидность на клиенте ещё раз
    if (!isFormValid()) {
        showAllErrors();
        return; // отправка на сервер блокируется
    }

    const data = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value
    };

    const response = await fetch("submit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("result").textContent = JSON.stringify(result);
});