const client = new HttpClient("https://jsonplaceholder.typicode.com");

async function getUsers() {
  try {
    const data = await client.get("/users");
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    document.getElementById("output").textContent = "Erreur : " + error.message;
  }
}
