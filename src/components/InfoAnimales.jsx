import { CircularProgress, TableBody, TableContainer, TableRow } from "@mui/material";
import { useContext } from "react";
import ErrorContext from "../ErrorContext";
import { Paper, Table, TableCell, TableHead, Typography, Alert } from '@mui/material';
import AnimalesContext from "../AnimalesContext";




export default function InfoAnimales(params) {
    const { error } = useContext(ErrorContext)
    const { infoAnimales } = useContext(AnimalesContext)
    const { loading, inci } = params.data

    console.log(inci)
    return (
        <>

            <div id="contenedor-animales">

                <div id='loading'>
                    {loading && <CircularProgress />}
                </div>

                {infoAnimales !== null ? (

                    <div className='h1-container-animales'>
                        <Typography className='animales' fontWeight={600} variant='h3'>Animales</Typography>
                    </div>

                ) : (
                    error == null ? ("") : (
                        <Alert variant="outlined" severity="error">{error}</Alert>
                    )
                )}

                {infoAnimales !== null ? (
                    <div id="tabla-animales-mui">
                        <TableContainer component={Paper}>
                            <Table sx={{ backgroundColor: "#e5e9ee", minWidth: 650 }} aria-label="simple table">

                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#EDDEA4", borderBottom: "4px solid black" }}>
                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Código</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Espécimen</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Estado</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Sexo</Typography></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {infoAnimales.map((animal, i) => (
                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="center">{animal.ANIM_CODIGO}</TableCell>
                                            <TableCell align="center">{animal.ESP_NOMBRE}</TableCell>
                                            <TableCell align="center">{animal.ESTANIM_NOMBRE}</TableCell>
                                            <TableCell align="center">{animal.SEXO_DESC}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </div>


                ) : (error == null ? ("") : (
                    <Alert variant="outlined" severity="error">{error}</Alert>
                )
                )}
            </div>


            {infoAnimales !== null ? (
                <div className="contenedor-incidencias">

                    <div className="h1-container-incidencias">
                        <Typography className='incidencias' fontWeight={600} variant='h3'>Incidencias</Typography>
                    </div>

                    <div className="tabla-incidencias-mui">
                        <TableContainer component={Paper}>
                            <Table sx={{ backgroundColor: "#e5e9ee", minWidth: 650 }} aria-label="simple table">

                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#EDDEA4", borderBottom: "4px solid black" }}>
                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Tipo de incidencia</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Codigo</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="h6" fontWeight={600} >Descripcion</Typography></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {inci.map((incidencia, i) => (
                                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="center">{incidencia.INCID_TINCID_ID}</TableCell>
                                            <TableCell align="center">{incidencia.INCID_CODIGO}</TableCell>
                                            <TableCell align="center">{incidencia.INCID_DESC}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </div>
                </div>
            ) : (error == null ? ("") : (
                <Alert variant="outlined" severity="error">{error}</Alert>
            )
            )}

        </>
    )
}