const form = document.querySelector('.form')
const priceEl = document.getElementById('single-price')

function calculatePrice() {
  let total = 0
  const checkedInputs = form?.querySelectorAll('input:checked')
  checkedInputs?.forEach(input => {
    total += Number(input.dataset.price || 0)
  })
  if (priceEl) {
    priceEl.textContent = total.toLocaleString('ru-RU') + ' ₽'
  }
}

form?.addEventListener('change', calculatePrice)

calculatePrice()