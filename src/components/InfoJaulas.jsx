import * as React from 'react';
import { useContext } from 'react';
import ErrorContext from '../ErrorContext';
import InfoAnimales from './InfoAnimales';
import { useJaula } from "../hooks/useJaulas";
import Chat from "./Chat";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    IconButton,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import ForwardIcon from '@mui/icons-material/Forward';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import CropFreeIcon from '@mui/icons-material/CropFree';
import Alert from '@mui/material/Alert';
import AnimalesContext from '../AnimalesContext';



export default function InfoJaulas() {

    const { error } = useContext(ErrorContext)
    const { infoAnimales } = useContext(AnimalesContext)
    const { handleForm, handleJaulas, infoJaula, loading, tokenApi, inci } = useJaula()


    return (
        <>
            <div id="contenedor-contenido">

                {tokenApi &&
                    <form id="input-codigo-barras">

                        {infoAnimales == null ? (
                            <div className='container-flecha'>
                                <ForwardIcon className='forwardIcon' fontSize='large'></ForwardIcon>
                            </div>
                        ) : ("")}

                        <input
                            className="input-codigo"
                            placeholder="Escanea tu código"
                            type="text"
                            name="id"
                            onChange={handleForm} />

                        <IconButton onClick={handleJaulas}>
                            <Fab size="secondary" color="white" aria-label="add" sx={{ backgroundColor: "#F4F1DE", border: "3px solid black" }}>
                                <CropFreeIcon className="sendIcon" fontSize="large">Enviar</CropFreeIcon>
                            </Fab>
                        </IconButton>

                    </form>
                }


                <div id='loading'>
                    {loading && <CircularProgress />}
                </div>


                {infoJaula !== null ? (
                    <div id="todo">
                        <div className="tabla-y-chat-mui">
                            <div className='tablas'>
                                <div className='contenedor-jaulas'>

                                    <div className='h1-container-jaulas'>
                                        <Typography className='jaulas' fontWeight={600} variant='h3'>Jaulas</Typography>
                                    </div>

                                    <div className="tabla-jaula-mui">
                                        <TableContainer component={Paper}>
                                            <Table sx={{ backgroundColor: "#e5e9ee", minWidth: 650 }} aria-label="simple table">

                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: " #EDDEA4", borderBottom: "4px solid black" }}>
                                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Código</Typography></TableCell>
                                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Cepa</Typography></TableCell>
                                                        {infoJaula[0].SALA_NOMBRE && <TableCell align="center" ><Typography variant="h6" fontWeight={600} >Sala</Typography></TableCell>}
                                                        {infoJaula[0].RACK_NOMBRE && <TableCell align="center" ><Typography variant="h6" fontWeight={600} >Rack</Typography></TableCell>}
                                                        {infoJaula[0].JAULA_FILA && <TableCell align="center" ><Typography variant="h6" fontWeight={600} >Fila</Typography></TableCell>}
                                                        {infoJaula[0].JAULA_COL && <TableCell align="center" fontWeight={600}><Typography variant="h6" fontWeight={600} >Columna</Typography></TableCell>}
                                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Descripción</Typography></TableCell>
                                                        {!infoAnimales && <TableCell align="center"><Typography variant="h6" fontWeight={600} >Espécimen</Typography></TableCell>}
                                                        {!infoAnimales && <TableCell align="center"><Typography variant="h6" fontWeight={600} >Sexo</Typography></TableCell>}
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {infoJaula.map((jaula, i) => (
                                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row">{jaula.JAULA_CODIGO}</TableCell>
                                                            <TableCell align="center">{jaula.CEPA_ACR}</TableCell>
                                                            {jaula.SALA_NOMBRE && <TableCell align="center">{jaula.SALA_NOMBRE}</TableCell>}
                                                            {jaula.RACK_NOMBRE && <TableCell align="center">{jaula.RACK_NOMBRE}</TableCell>}
                                                            {jaula.JAULA_FILA && <TableCell align="center">{jaula.JAULA_FILA}</TableCell>}
                                                            {jaula.JAULA_COL && <TableCell align="center">{jaula.JAULA_COL}</TableCell>}
                                                            <TableCell align="center">{jaula.TJAULA_DESC}</TableCell>
                                                            {!infoAnimales && <TableCell align="center">{jaula.ESP_NOMBRE}</TableCell>}
                                                            {!infoAnimales && <TableCell align="center">{jaula.SEXO_DESC}</TableCell>}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>

                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>


                                <InfoAnimales data={{ loading, inci }} />
                            </div>


                            {infoAnimales == null ? (
                                <div className='info-escanea-tu-codigo'>
                                    <div className='info-escanea-header'>
                                        <Typography fontWeight={600} variant='h4'>Bienvenido!<WavingHandIcon className='wavingHandIcon' fontSize='medium'></WavingHandIcon></Typography>
                                    </div>

                                    <div className='container-texto-bienvenido'>
                                        <Typography className="texto-bienvenido" fontWeight={600} variant='h5' align="center">
                                            Escanea el código de la jaula para comenzar
                                        </Typography>
                                    </div>
                                </div>
                            ) : ("")}


                            <Chat />
                        </div>
                    </div>
                ) : (
                    error == null ? ("") : <div className='error'>
                        <Alert variant="outlined" severity="error">{error}</Alert>
                    </div>
                )
                }
            </div>
        </>
    );
}