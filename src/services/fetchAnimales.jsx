import { useContext } from "react";
import ErrorContext from "../ErrorContext";
import AnimalesContext from "../AnimalesContext";


export function fetchAnimales() {
    const { setInciAnimData } = useContext(AnimalesContext)

    //Get Animales by Jaula ID
    const animalesByJaulaId = async ({ form, setInfoAnimales, setLoading }) => {
        const data = {
            headers: {
                tokenApi: localStorage.getItem('apiToken')
            },
        }
        setLoading(true)

        fetch(`https://demovoiceappnb.azurewebsites.net/animales/jaula/${form.id}`, data)
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setInfoAnimales(res.document.records)
            })
    }



    //incidencias - animales
    const incidenciasAnim = async () => {
        const data = {
            headers: {
                tokenApi: localStorage.getItem('apiToken')
            },
        }

        //fetch(`http://localhost:3000/animales/incidencias`, data)

        fetch(`https://demovoiceappnb.azurewebsites.net/animales/incidencias`, data)
            .then(res => res.json())
            .then(res => {
                setInciAnimData(res.document.records)
            })
    }


    return {
        animalesByJaulaId, incidenciasAnim
    }

}