const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');
menu?.addEventListener('click', () => nav?.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
