document.getElementById('comment-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const comment = document.getElementById('comment').value.trim();
  if (!comment) return;
  window.location.href = 'mailto:ovprakash@gmail.com?subject=' + encodeURIComponent('Comment: D365 project margin article') + '&body=' + encodeURIComponent(comment + '\n\nArticle: https://www.virajprakash365.com/d365-project-margin/');
});

