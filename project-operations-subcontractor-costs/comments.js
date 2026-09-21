document.getElementById('comment-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const comment = document.getElementById('comment').value.trim();
  if (!comment) return;
  window.location.href = 'mailto:ovprakash@gmail.com?subject=' + encodeURIComponent('Comment: Project Operations subcontractor costs') + '&body=' + encodeURIComponent(comment + '\n\nArticle: https://www.virajprakash365.com/project-operations-subcontractor-costs/');
});


