import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

import AudioTable from '../components/AudioTable';
import Layout from '../components/Layout';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';

export interface IAudioFile {
  file: File;
  previewURL: string;
  name: string;
}

function Upload() {
  const [selectedFiles, setSelectedFiles] = useState<IAudioFile[]>([]);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const updatedFiles: IAudioFile[] = Array.from(files).map((file) => ({
        file,
        previewURL: URL.createObjectURL(file),
        name: file.name,
      }));

      setSelectedFiles(updatedFiles);

      updatedFiles.map((file) => {
        if (file.file.size > 3000000) {
          toast.error('File size is too big');
          setSelectedFiles([]);
        }
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Layout>
      <Typography>Upload your audio files</Typography>

      <FormControl>
        <Input
          id="audio"
          aria-describedby="single-audio-upload"
          type="file"
          inputProps={{
            accept: '.mp3, .wav',
            size: 3000000,
          }}
          hidden
          onChange={handleFileInputChange}
        />
        <FormHelperText id="my-helper-text">
          Upload a single audio file (mp3/wav only)
        </FormHelperText>

        <Button>Upload Single audio file</Button>
      </FormControl>

      <FormControl>
        <Input
          id="audio"
          aria-describedby="single-audio-upload"
          type="file"
          inputProps={{
            accept: '.mp3, .wav',
            size: 3000000,
            multiple: true,
          }}
          onChange={handleFileInputChange}
        />
        <FormHelperText id="my-helper-text">
          Upload multiple audio files (mp3/wav only)
        </FormHelperText>

        <Button>Upload multiple audio files</Button>
      </FormControl>

      {selectedFiles.length && <AudioTable audioDatas={selectedFiles} />}
    </Layout>
  );
}

export default Upload;
