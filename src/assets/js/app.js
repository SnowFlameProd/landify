let navToggle = document.querySelector('#navToggle');
let nav = document.querySelector('#nav');

navToggle.addEventListener("click", function() {
  nav.classList.toggle('show');
});