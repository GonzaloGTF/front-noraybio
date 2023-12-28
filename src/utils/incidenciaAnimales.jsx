import { useContext } from "react"
import AnimalesContext from "../AnimalesContext"

export default function inciAnim() {
    const { setInciAnimData } = useContext(AnimalesContext)

    //incidencias - animales
    const incidenciasAnimales = async () => {
        const data = {
            headers: {
                tokenApi: localStorage.getItem('apiToken')
            },
        }
        console.log("hola")
        fetch(`http://localhost:3000/animales/incidencias`, data)

            //fetch(`https://demovoiceappnb.azurewebsites.net/animales/incidencias`, data)
            .then(res => res.json())
            .then(res => {
                setInciAnimData(res.document.records)
            })
    }
    return { incidenciasAnimales }
}