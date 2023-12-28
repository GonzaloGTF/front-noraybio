import { useState, useCallback, useEffect, useContext } from "react"
import { fetchJaula } from "../services/fetchJaula"
import token from "../services/tokens"
import { fetchAnimales } from "../services/fetchAnimales"
import AnimalesContext from "../AnimalesContext"
import preguntasFetch from "../services/preguntas"


export function useJaula() {
    const [infoJaula, setInfoJaula] = useState(null)
    const [form, setForm] = useState("")
    const [loading, setLoading] = useState(false);
    const [tokenApi, setTokenApi] = useState(null)
    const [inciAnim, setInciAnim] = useState([])
    const [inci, setInci] = useState([])


    const { infoAnimales, setInfoAnimales,
        inciAnimData, setInciAnimData,
        inciData } = useContext(AnimalesContext)
    const { jaulaId, jaulas } = fetchJaula()
    const { apiToken } = token()
    const { getIncidencias } = preguntasFetch()
    const { animalesByJaulaId, incidenciasAnim } = fetchAnimales()

    //generate token
    useEffect(() => {
        if (!localStorage.getItem("apiToken")) {
            apiToken(setTokenApi)
        } else {
            setTokenApi(localStorage.getItem('apiToken'))
        }

        if (tokenApi) {
            jaulas({ setInfoJaula, setLoading })
        }
    }, [tokenApi]);

    //incidencias-animales
    useEffect(() => {
        if (infoAnimales !== null && inciAnimData !== null) {
            const guInc = []
            infoAnimales.forEach(animal => {
                const ifInciAnim = inciAnimData.filter(inciAnim => inciAnim.INCANIM_ANIM_ID === animal.ANIM_ID)

                if (ifInciAnim.length !== 0) {
                    guInc.push(...ifInciAnim)
                }
            })

            setInciAnim(guInc)
        }
    }, [inciAnimData, inciData, infoAnimales])


    useEffect(() => {
        if (inciAnim !== null) {
            const inciFinal = []
            console.log("hola")
            inciAnim.forEach(inc => {
                const incide = inciData.filter(inciden => inciden.INCID_ID === inc.INCANIM_INCID_ID)
                inciFinal.push(...incide)
            })
            const inciSinDupl = [...(new Set(inciFinal))]
            setInci(inciSinDupl)
        }
    }, [inciData, inciAnim])




    //act form
    const handleForm = useCallback((e) => {
        let userTemp = { ...form }
        userTemp[e.target.name] = e.target.value
        setForm(userTemp)
    }, [form])



    //get jaula by id
    const handleJaulas = (e) => {
        e.preventDefault()
        incidenciasAnim()
        getIncidencias()
        jaulaId({ form, setInfoJaula, setLoading })
        animalesByJaulaId({ form, setInfoAnimales, setLoading })
        incidenciasAnim({ setInciAnimData })

        // const animales = await animalesByJaulaId({ form, setLoading })
        //setInfoAnimales(animales.document.records)
    }


    return {
        handleForm, form,
        handleJaulas, infoJaula, infoAnimales,
        loading, tokenApi, inci
    }
}   
