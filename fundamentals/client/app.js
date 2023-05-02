async function fetchGreetings() {
  const result = await fetch("http://localhost:9000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: "query {greeting}" }),
  })
    .then((res) => res.json())
    .then(({ data: { greeting } }) => greeting);
  return result;
}

fetchGreetings().then((greeting) => {
  console.log("greeting", greeting);
  document.getElementById("result").textContent = greeting;
});
