import { useEffect, useState } from "react";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";
import ErrorContext from "../ErrorContext";
import { useContext } from "react";
import token from "../services/tokens";
import preguntasFetch from "../services/preguntas"
import { numberToWordsEsp } from 'number-to-words-esp';


export function useSpeech() {

    const [chatSpeech, setChatSpeech] = useState([])
    const [preguntas, setPreguntas] = useState(null)
    const [optionSelected, setOptionSelected] = useState(null)
    const [chat, setChat] = useState(["¿Qué quieres hacer?"])
    const [respuestasForm, setRespuestasForm] = useState([])
    const [tipo, setTipo] = useState([])

    const [dataSpeech, setDataSpeech] = useState(null)
    const [micro, setMicro] = useState(false)
    const [actMicro, setActMicro] = useState(true)

    const [enviar, setEnviar] = useState(false)
    const [edit, setEdit] = useState(false)
    const [reset, setReset] = useState(false)

    const options = ["Incidencia", "Baja", "Servicio"]
    const optionSpeech = options.map(option => option.toLowerCase())

    const { getPreguntas, enviarFormulario, getTipo } = preguntasFetch()
    const { setError } = useContext(ErrorContext)
    const { speechToken } = token()


    //activar - desactivar micro
    const activeMicro = () => {
        setActMicro(!actMicro)
    }

    //get token-speech
    useEffect(() => {
        if (!localStorage.getItem('speechToken')) {
            speechToken(setDataSpeech)
        } else {
            setDataSpeech(JSON.parse(localStorage.getItem("speechToken")))
        }
    }, []);


    //expire? => get new token
    useEffect(() => {
        if (dataSpeech !== null) {

            const token = dataSpeech.token
            const [header, payload, signature] = token.split('.');
            const decodedPayload = JSON.parse(atob(payload));

            const tiempoExpiracion = decodedPayload.exp;

            const expiracionDate = new Date(tiempoExpiracion * 1000);
            const refreshDate = new Date(new Date().getTime() - 60 * 1000)

            if (expiracionDate < refreshDate) {
                speechToken(setDataSpeech)
            } else {
                if (actMicro) {
                    speechAct(dataSpeech)
                }
            }
        }
        else {
            setError("No tienes permisos para utilizar el micrófono con azure, identificate para poder usarlo.")
        }
    }, [dataSpeech, micro, actMicro])


    //activar speech-text
    const speechAct = (data) => {
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
            data.token,
            data.region
        );

        speechConfig.speechRecognitionLanguage = "es-ES";

        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(
            speechConfig,
            audioConfig
        );

        recognizer.recognizeOnceAsync((result) => {


            if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                setError(null);
                setChatSpeech((prevSpeech) => [...prevSpeech, result.text]);
                setChat((prevChat) => [...prevChat, result.text]);
                setMicro(!micro)
            } else {
                setError("El discurso se canceló o no se pudo reconocer. Asegúrese de que su micrófono funcione correctamente.");
                setMicro(!micro)
            }
        });
    }




    //preguntas en chat
    useEffect(() => {
        if (chatSpeech.length !== 0 && preguntas !== null && !enviar) {

            const numeroPregunta = chatSpeech.length - 1;
            setError(null)
            setRespuestasForm((prevRes) => [...prevRes, chatSpeech[chatSpeech.length - 1]])

            if (chatSpeech.includes("Reset.")) {
                setReset(!reset)
            }

            else if (numeroPregunta < preguntas?.length) {

                //validar tipo incidencia en BBDD
                const ifValid = tipo.find((tip) => chatSpeech[1]?.replace(/\.$/, '').toLowerCase() == (tip.TINCID_NOMBRE.toLowerCase()));
                if (optionSelected.toLowerCase() == optionSpeech[0] && numeroPregunta == 1) {
                    if (ifValid) {
                        setChat((prevChat) => [...prevChat, `${numeroPregunta + 1}- ${preguntas[numeroPregunta].QUEST_TEXT}`]);
                        const respuestasTemp = respuestasForm
                        respuestasTemp[1] = ifValid.TINCID_ID
                        setRespuestasForm(respuestasTemp)
                    }
                    else {
                        setError("El tipo de incidencia no coincide con ninguno registrado. Repita la respuesta.")
                        const chatSpeechTemp = chatSpeech
                        chatSpeechTemp.pop()
                        setChatSpeech(chatSpeechTemp)
                    }
                }

                else {
                    setChat((prevChat) => [...prevChat, `${numeroPregunta + 1}- ${preguntas[numeroPregunta].QUEST_TEXT}`]);
                }
            }
            else {
                setChat((prevChat) => [...prevChat, "¿Quieres enviar el formulario o editarlo?"])
                setChatSpeech([])
                setEnviar(true)
            }
        }
    }, [preguntas, chatSpeech])

    useEffect(() => {
        setError(null)
        setChatSpeech([]);
        setPreguntas(null)
        setOptionSelected(null)
        setTipo([])
        setChat(["¿Qué quieres hacer?"]);
        setRespuestasForm([])
        setEnviar(false)
        setEdit(false)
    }, [reset])

    //logica de respuestas
    useEffect(() => {
        const first = chatSpeech[0]?.toLowerCase()
        const second = chatSpeech[1]?.toLowerCase()
        const last = chatSpeech[chatSpeech.length - 1]?.toLowerCase()



        //opcion no valida
        const noOption = () => {
            setChatSpeech([]);
            setError("Disculpe, no le hemos entendido o no ha dicho correctamente lo que quiere hacer");
        }


        //resetear todo
        if (chatSpeech.includes("Reset.")) {
            setReset(!reset)
        }

        //elegir primera opcion + preguntas
        else if (!enviar) {

            const opcionElegir = optionSpeech.find((opt) => first?.toLowerCase().includes(opt));
            if (opcionElegir) {
                const i = optionSpeech.indexOf(opcionElegir)

                setOptionSelected(options[i])

                if (preguntas == null) {
                    getPreguntas(optionSpeech[i], setPreguntas)
                    getTipo(optionSpeech[i], setTipo)
                }
            }

            else if (chatSpeech.length !== 0) {
                noOption()
            }
        }

        //logica para enviar o editar preguntas
        else if (enviar) {

            //enviar form
            if (first?.includes("envia")) {
                setError(null)

                enviarFormulario(respuestasForm, optionSelected.toLowerCase(), setReset, setChat, reset)
            }

            //fin edit
            else if (edit && chatSpeech.length == 0) {
                setChat((prevChat) => [...prevChat, "Pregunta editada, ¿Quieres enviar el formulario o editar otra pregunta?"])
                setEdit(false)
            }

            //editar pregunta
            else if (first?.includes("edit")) {

                //array con el num de preguntas a elegir
                const generarEditNum = (cantidad) => {
                    const editNum = Array.from({ length: cantidad }, (_, index) => {
                        const numero = index + 1;
                        return { letter: numberToWordsEsp(numero).toLowerCase(), num: numero.toString() };
                    });
                    return editNum;
                };
                const editNum = generarEditNum(preguntas.length)


                //if (num pregunta a editar)
                const numeroAEditar = editNum.find(({ letter, num }) =>
                    last?.toLowerCase().includes(letter) || last?.toLowerCase().includes(num) ||
                    second?.toLowerCase().includes(letter) || second?.toLowerCase().includes(num)
                );


                if (chatSpeech.length == 1) {
                    setError(null)
                    setChat((prevChat) => [...prevChat, "¿Qué número de pregunta quieres editar?"])
                }

                else if (chatSpeech.length >= 2) {
                    if (numeroAEditar) {
                        if (edit && chatSpeech.length == 3) {
                            const respuestasFormTemp = respuestasForm
                            respuestasFormTemp[numeroAEditar.num] = chatSpeech[2]
                            setRespuestasForm(respuestasFormTemp)
                            setChatSpeech([])
                        }

                        else if (chatSpeech.length > 2) {
                            const chatSpeechTemp = chatSpeech.slice(0, 1).concat(chatSpeech.slice(-1));
                            setChatSpeech(chatSpeechTemp)
                        }

                        else {
                            setChat((prevChat) => [...prevChat, `${numeroAEditar.num}- ${preguntas[numeroAEditar.num - 1].QUEST_TEXT}`])
                            setEdit(true)
                            setError(null)
                        }
                    }

                    else {

                        setError("Disculpe, no le hemos entendido o no ha dicho un numero de pregunta valido.");
                    }
                }

            }
            else if (chatSpeech.length !== 0) {
                noOption()
            }
        }


    }, [chatSpeech]);





    //(input para voz)
    const handleChatProv = (text) => {
        setChat((prevChat) => [...prevChat, text]);
        setChatSpeech((prevSpeech) => [...prevSpeech, text]);

    }


    return {
        chat,
        chatSpeech,
        preguntas, optionSelected,
        options,
        activeMicro, actMicro,


        handleChatProv
    };

}
