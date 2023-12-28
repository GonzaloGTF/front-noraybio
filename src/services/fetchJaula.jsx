import { useContext } from "react"
import ErrorContext from "../ErrorContext"

export function fetchJaula() {
    const { setError } = useContext(ErrorContext)

    const errorLogin = "Error al buscar datos, identifícate para poder acceder."
    const data = {
        headers: {
            tokenApi: localStorage.getItem("apiToken")
        },
    }


    //Get TODAS las Jaulas
    const jaulas = ({ setInfoJaula, setLoading }) => {

        fetch(`https://demovoiceappnb.azurewebsites.net/jaulas`, data)
            .then(res => res.json())
            .then(res => {

                if (res.document) {
                    setError(null)
                    setInfoJaula(res.document.records)
                } else {
                    setError(errorLogin)
                }

                setLoading(false)
            })
            .catch(error => console.error(error))
    }


    //Get Jaula by ID
    const jaulaId = ({ form, setInfoJaula, setLoading }) => {

        setLoading(true)

        fetch(`https://demovoiceappnb.azurewebsites.net/jaulas/${form.id}`, data)
            .then(res => res.json())
            .then(res => {

                if (res.document) {
                    setError(null)
                    setInfoJaula([res.document])
                } else if (res.message == "No Record Found") {
                    setError("No se ha encontrado una jaula con esa ID.")
                } else {
                    setError(errorLogin)
                }

                setLoading(false)
            })
            .catch(error => console.error(error))
    }


    return { jaulaId, jaulas }
}