async function run() {
  await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: "Test" }),
  }).then(() => {
    console.log("Data submitted");
  });
}
run();
