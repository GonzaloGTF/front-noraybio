import { useContext } from "react"
import ErrorContext from "../ErrorContext"
import AnimalesContext from "../AnimalesContext";
import { fetchAnimales } from "./fetchAnimales";


export default function preguntasFetch() {
    const { setError } = useContext(ErrorContext)
    const { infoAnimales, setInciData, setInciAnimData } = useContext(AnimalesContext)
    //const { incidenciasAnim } = fetchAnimales()

    //get preguntas seleccionadas
    const getPreguntas = (option, setPreguntas) => {
        const data = {
            headers: {
                tokenApi: localStorage.getItem("apiToken")
            },
        }
        //fetch(`http://localhost:3000/preguntas/select/${option}`, data)

        fetch(`https://demovoiceappnb.azurewebsites.net/preguntas/select/${option}`, data)
            .then(res => res.json())
            .then(res => {

                if (!res.error) {
                    const preguntas = res.document.records
                    preguntas.sort((a, b) => a.QUEST_ORDER - b.QUEST_ORDER);
                    setPreguntas(preguntas)
                    setError(null)
                } else {
                    setError("No se han encontrado las preguntas correctamente.");
                }
            })
            .catch((e) => console.error('Error:', e))
    }



    //enviar respuestas
    const enviarFormulario = (resSend, opt, setReset, setChat, reset) => {
        let respuestas = []
        console.log(resSend)
        resSend.map((res, i) => {
            if (i > 0) {
                respuestas.push(res)
            }
        })

        const data = {
            method: 'POST',
            headers: {
                tokenApi: localStorage.getItem("apiToken"),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ respuestas })
        }

        //fetch(`http://localhost:3000/preguntas/update/${opt}`, data)

        fetch(`https://demovoiceappnb.azurewebsites.net/preguntas/update/${opt}`, data)
            .then(res => res.json())
            .then(res => {
                if (res.message == "Record Created") {
                    const dataId = {
                        headers: {
                            tokenApi: localStorage.getItem("apiToken"),
                        },

                    }
                    //fetch(`http://localhost:3000/preguntas/id`, dataId)   //get id de la incidencia registrada
                    fetch(`https://demovoiceappnb.azurewebsites.net/preguntas/id`, dataId)
                        .then(res => res.json())
                        .then(res => {

                            const numInc = res.document.records.length
                            const incId = res.document.records[numInc - 1].INCID_ID

                            infoAnimales.map((animal) => {
                                const aniId = animal.ANIM_ID
                                const dataAnim = {
                                    method: 'POST',
                                    headers: {
                                        tokenApi: localStorage.getItem("apiToken"),
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ incId, aniId })
                                }
                                //fetch(`http://localhost:3000/preguntas/animalInc`, dataAnim)
                                fetch(`https://demovoiceappnb.azurewebsites.net/preguntas/animalInc`, dataAnim)
                                    .then(res => res.json())
                                    .then(res => {

                                        setReset(!reset)
                                        setTimeout(() => {
                                            //  incidenciasAnim()




                                            //fetch(`http://localhost:3000/animales/incidencias`, data)

                                            fetch(`https://demovoiceappnb.azurewebsites.net/animales/incidencias`, dataId)
                                                .then(res => res.json())
                                                .then(res => {
                                                    console.log(res)
                                                    setInciAnimData(res.document.records)
                                                })






                                            setChat([`Enviado y registrado correctamente, ¿Qué quieres hacer?`])
                                        }, 100);
                                    })
                            })

                        })

                } else {
                    setReset(!reset)
                    setTimeout(() => {
                        setChat([`Error al enviar el formulario, vuelve a intentarlo.`])
                    }, 100);

                }
            })
            .catch((e) => console.error('Error:', e))
    }


    //incidencias
    const getIncidencias = async () => {
        const dataId = {
            headers: {
                tokenApi: localStorage.getItem("apiToken"),
            },
        }
        //fetch(`http://localhost:3000/preguntas/id`, dataId)   
        await fetch(`https://demovoiceappnb.azurewebsites.net/preguntas/id`, dataId)
            .then(res => res.json())
            .then(res => {
                setInciData(res.document.records)
            })
    }



    //get tipo options
    const getTipo = (option, setTipo) => {
        const data = {
            headers: {
                tokenApi: localStorage.getItem("apiToken")
            },
        }

        //fetch(`http://localhost:3000/preguntas/tipo/${option}`, data)
        fetch(`https://demovoiceappnb.azurewebsites.net/preguntas/tipo/${option}`, data)
            .then(res => res.json())
            .then(res => {
                if (!res.error) {
                    setTipo(res.document.records)
                } else {
                    setError("Error al conectar con la API.");
                }
            })
            .catch((e) => console.error('Error:', e))
    }


    return {
        getPreguntas, enviarFormulario, getTipo, getIncidencias
    }
}