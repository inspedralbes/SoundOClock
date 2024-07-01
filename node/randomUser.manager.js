async function obtenerUsuarioAleatorio() {
  const url = "https://randomuser.me/api/";
  const response = await fetch(url);
  const data = await response.json();
  const usuario = data.results[0];
  return usuario;
}

async function getUser() {
  const user = await obtenerUsuarioAleatorio();
  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    picture: user.picture.large,
  };
}

const randomUser = {
  getUser,
};

export default randomUser;
