import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';
import { useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import LoopIcon from '@mui/icons-material/Loop';

interface Props {
  audioDatas: {
    name: string;
    file: File;
    previewURL: string;
  }[];
}

export default function AudioTable(props: Props) {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const handlePlay = (index: number) => {
    const audioRef = audioRefs.current[index];
    if (audioRef) {
      audioRef.play();
    }
  };

  const handlePause = (index: number) => {
    const audioRef = audioRefs.current[index];
    if (audioRef) {
      audioRef.pause();
    }
  };

  const handleStop = (index: number) => {
    const audioRef = audioRefs.current[index];
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
  };

  const handleRepeat = (index: number) => {
    const audioRef = audioRefs.current[index];
    if (audioRef) {
      audioRef.loop = !audioRef.loop;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Controls</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.audioDatas.map((audio, index) => (
            <TableRow
              key={audio.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {audio.name}
              </TableCell>
              <TableCell align="right">
                <Box>
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={audio.previewURL}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <div>
                    <Button onClick={() => handlePlay(index)} aria-label="Play">
                      <PlayArrowIcon />
                    </Button>
                    <Button
                      onClick={() => handlePause(index)}
                      aria-label="Pause"
                    >
                      <PauseIcon />
                    </Button>
                    <Button onClick={() => handleStop(index)} aria-label="Stop">
                      <StopIcon />
                    </Button>
                    <Button
                      onClick={() => handleRepeat(index)}
                      aria-label="Repeat"
                    >
                      <LoopIcon />
                    </Button>
                  </div>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
