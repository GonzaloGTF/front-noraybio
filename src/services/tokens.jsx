import { useContext } from "react"
import ErrorContext from "../ErrorContext"

export default function token() {
  const { setError } = useContext(ErrorContext)


  //generate speech-text token
  const speechToken = async (setDataSpeech) => {
    //fetch('http://localhost:3000/tokens/speech')

    fetch('https://demovoiceappnb.azurewebsites.net/tokens/speech')
      .then(res => res.json())
      .then(res => {
        if (!res.error) {
          localStorage.setItem("speechToken", JSON.stringify(res))
          setDataSpeech(res)
          setError(null)
        } else {
          setError("Error al autentificar con azure");
        }
      })
      .catch((e) => console.error('Error:', e))
  }

  //generate api token
  const apiToken = (setTokenApi) => {
    fetch('https://demovoiceappnb.azurewebsites.net/tokens/api')
      .then(res => res.json())
      .then(res => {

        if (!res.error) {
          localStorage.setItem("apiToken", res.AccessToken)
          setTokenApi(res.AccessToken)
          setError(null)
        } else {
          setError("Error al autentificar en la api de NorayBio")
        }
      })
      .catch((e) => console.error('Error:', e))
  }

  return { speechToken, apiToken }
}