const deletepro = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=proId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const proele=btn.closest('article'); 

  fetch('/deletepro/' + prodId , {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  }).then(result => {
  return result.json();
  })
  .then(data => {
    proele.parentNode.removeChild(proele);
  })
  .catch( err => {
    console.error();
  })
};