import TempMail from "node-temp-mail";

async function fetchAndLogEmails() {
  try {
    const address = new TempMail("testAddress");
    const emails = await address.fetchEmails();
    return emails.address; // Retorna el cuerpo del primer email
  } catch (err) {
    console.error(err);
    return null; // Manejo del error, retorna null u otra cosa según tu lógica
  }
}

function generateRandomPassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

function getRandomPFP() {
  const randomBoolean = Math.random() < 0.5;

  // Asignar 'male' si es true, 'female' si es false
  const randomGender = randomBoolean ? "male" : "female";

  return `https://xsgames.co/randomusers/avatar.php?g=${randomGender}`;
}

async function getUser() {
  const email = await fetchAndLogEmails();
  return {
    email: email,
    password: generateRandomPassword(8),
    pfp: getRandomPFP(),
  };
}

// Como getUser es asíncrona, debes esperar su resultado para imprimirlo correctamente
getUser()
  .then((user) => {
    console.log(user);
  })
  .catch((err) => {
    console.error(err);
  });
