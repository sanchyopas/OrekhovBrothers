const createTabForm = document.getElementById("create-tab-form")

createTabForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  console.log(`================ ${formData} =======================`)

  const response = await fetch('/category/tabs/create/', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  console.log(`--------------- ${data.title} -----------------------`);
  console.log(`--------------- ${data.id} -----------------------`);
  console.log(`--------------- ${data.status} -----------------------`);

})