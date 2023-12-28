import React, { useContext, useEffect, useRef, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import ErrorContext from "../ErrorContext";
import { useJaula } from "../hooks/useJaulas";
import { IconButton, Typography, TextField, Alert } from '@mui/material/';
import Fab from '@mui/material/Fab';


import { Mic as MicIcon, MicOff as MicOffIcon, Send as SendIcon } from '@mui/icons-material';
import AnimalesContext from "../AnimalesContext";



export default function Chat() {
  const { infoAnimales } = useContext(AnimalesContext)


  if (infoAnimales !== null) {

    const { chat, options, optionSelected, handleChatProv, activeMicro, actMicro } = useSpeech();
    const { error } = useContext(ErrorContext);
    const chatContainerRef = useRef(null);

    useEffect(() => {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [chat, error]);

    const { form, handleForm } = useJaula()


    return (
      <>


        <div className="chat">
          <div className="opciones">{options.map((opt, i) => (

            <div key={i} className={opt === optionSelected ? 'selected' : 'noSelected'}>
              <Typography
                className="opt"
                variant="h6"
                align="center"
                fontWeight={900}>
                {opt}
              </Typography>
            </div>
          ))}

          </div>

          <div className="texto-chat" ref={chatContainerRef}>

            <div className="chat-container">
              {chat.map((com, i) => (

                <div className="pregunta-principio" key={i}>

                  <Typography fontSize={'small'} fontWeight={900}>
                    {com}
                  </Typography>

                </div>
              ))}

              {error == null ? ("") : (
                <div className='error'>
                  <Alert variant="outlined" severity="error">{error}</Alert>
                </div>
              )}
            </div>
          </div>


          <div className="input-voz">
            <div className="recIcon-div">

              <IconButton onClick={activeMicro}>
                {actMicro ? (
                  <Fab size="secondary" color="white" aria-label="add" sx={{ border: "3px solid black" }}>
                    <MicIcon className="recIcon" fontSize="large" />
                  </Fab>
                ) : (
                  <Fab size="secondary" color="white" aria-label="add" sx={{ border: "3px solid black" }}>
                    <MicOffIcon className="recOffIcon" fontSize="large" />
                  </Fab>
                )}
              </IconButton>
            </div>


            <input
              className="input-chat"
              placeholder="Escribe Aqui"
              type="text"
              name="voz"
              disabled={actMicro}
              onChange={handleForm} />


            <IconButton onClick={() => handleChatProv(form.voz)}>
              <Fab size="secondary" color="white" aria-label="add" sx={{ backgroundColor: "#F4F1DE;", border: "3px solid black" }}>
                <SendIcon className="sendIcon" fontSize="large">Enviar</SendIcon>
              </Fab>
            </IconButton>

          </div>
        </div>

      </>
    );
  }





}




