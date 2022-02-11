// const Firebase = require('./firebase')

const { getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const { initializeApp, getApps } = require('firebase/app')

let app, auth = null

module.exports.templateTags = [{
  name: 'firebase',
  displayName: 'Firebase uid / token',
  description: 'Recovery firebase uid and token',
  args: [
    {
      displayName: 'type',
      type: 'enum',
      options: [
        { displayName: 'uid', value: 'uid' },
        { displayName: 'token', value: 'token' }
      ]
    },
    {
      displayName: 'Email',
      type: 'string',
      defaultValue: '',
    },
    {
      displayName: 'Password',
      type: 'string',
      defaultValue: '',
    }
  ],
  async run({ context }, type, email, password) {
    if (!app && context.firebase && isJson(context.firebase.config)) {
      app = initializeApp(JSON.parse(context.firebase.config))
    }
    if (app && email && password) {
      auth = await getAuth(app)
      if (type === 'uid') return await getUid(email, password)
      if (type === 'token') return await generateToken(email, password)
    } else {
      return 'waiting values...'
    }
  },
}]

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

async function getUid(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((_) => auth.currentUser.uid)
    .catch((error) => {
      console.log(error)
      let message = ''
      switch (error.code) {
        case "auth/invalid-email":
          message = "Email ou senha Inválidos"
          break;
        case "auth/wrong-password":
          message = "Senha Invalida"
          break;
        case "auth/user-not-found":
          message = "Usuário não encontrado"
          break;
        default:
          message = "Email ou senha Inválidos"
          break;
      }
      return { message }
    })
}

async function generateToken(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((response) => auth.currentUser.getIdToken())
    .catch((error) => {
      let message = ''
      switch (error.code) {
        case "auth/invalid-email":
          message = "Email ou senha Inválidos0"
          break;
        case "auth/wrong-password":
          message = "Senha Invalida"
          break;
        case "auth/user-not-found":
          message = "Usuário não encontrado"
          break;
        default:
          message = "Email ou senha Inválidos1"
          break;
      }
      return { message }
    })
}