import React, { useState, useCallback, useRef } from 'react';
import { trpc } from '../../utils/trpc';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
  onResults: (results: any) => void;
  onStartProcessing?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onResults, onStartProcessing }) => {
  const [inputData, setInputData] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLocationsMutation = trpc.processLocations.useMutation({
    onSuccess: (data) => {
      onResults(data);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a .txt file');
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB limit
      setError('File size must be less than 1MB');
      return;
    }

    setFileName(file.name);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputData(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) {
      setError('Please provide location data');
      return;
    }

    onStartProcessing?.();
    processLocationsMutation.mutate({ inputData });
  };

  const handleLoadExample = () => {
    const exampleData = `3 4
4 3
2 5
1 3
3 9
3 3`;
    setInputData(exampleData);
    setFileName('example-data.txt');
    setError(null);
  };

  const handleClearFile = () => {
    setFileName('');
    setInputData('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Upload Location Data</h2>
        <p className={styles.description}>
          Upload a text file with location pairs or paste the data directly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div
          className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleDropzoneClick}
        >
          <div className={styles.dropzoneContent}>
            <div className={styles.icon}>📁</div>
            <h3>Drop your file here</h3>
            <p>or click to browse for a .txt file</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileInput}
              className={styles.fileInput}
            />
          </div>
        </div>

        {fileName && (
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>📄 {fileName}</span>
            <button
              type="button"
              onClick={handleClearFile}
              className={styles.removeFile}
              disabled={processLocationsMutation.isLoading}
            >
              ✕
            </button>
          </div>
        )}

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.textInput}>
          <label htmlFor="inputData" className={styles.label}>
            Paste Location Data:
          </label>
          <textarea
            id="inputData"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Enter location pairs, one per line:&#10;3 4&#10;4 3&#10;2 5"
            className={styles.textarea}
            rows={8}
            disabled={processLocationsMutation.isLoading}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleLoadExample}
            className={styles.exampleButton}
            disabled={processLocationsMutation.isLoading}
          >
            Load Example Data
          </button>
          
          <button
            type="submit"
            disabled={!inputData.trim() || processLocationsMutation.isLoading}
            className={styles.submitButton}
          >
            {processLocationsMutation.isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              'Process Data'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;