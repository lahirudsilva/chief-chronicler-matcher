import React, { useState } from 'react';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import FileUpload from '../components/FileUpload/FileUpload';
import Dashboard from '../components/Dashboard/Dashboard';
import styles from '../styles/Home.module.scss';

interface ProcessingResult {
  totalDistance: number;
  pairsCount: number;
  pairs: Array<{
    index: number;
    left: number;
    right: number;
    distance: number;
  }>;
  statistics: {
    average: number;
    maximum: number;
    minimum: number;
  };
}

export default function Home() {
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);


  // Health check query
  const healthQuery = trpc.health.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const handleResults = (processingResults: ProcessingResult) => {
    setResults(processingResults);
    setIsProcessing(false);
    setGlobalError(null); 
  };

  const handleReset = () => {
    setResults(null);
    setIsProcessing(false);
    setGlobalError(null); 
  };

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setGlobalError(null); 
  };

  const handleError = (error: string) => {
    setIsProcessing(false); 
    setGlobalError(error);   
    setResults(null);        
};

  return (
    <>
      <Head>
        <title>Chief Chronicler Location Matcher</title>
        <meta 
          name="description" 
          content="Help find the Chief Chronicler by analyzing location data and calculating optimal travel routes." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
  

        <div className={styles.content}>
          {!results && !isProcessing && (
            <div className={styles.uploadSection}>
              {globalError && (               
                <div className={styles.error}>
                  <strong>Error:</strong> {globalError}
                </div>
              )}
              <FileUpload 
                onResults={handleResults}
                onStartProcessing={handleStartProcessing}
                onError={handleError}
              />
            </div>
          )}

          {isProcessing && (
            <div className={styles.processingSection}>
              <div className={styles.processingCard}>
                <div className={styles.processingSpinner}></div>
                <h3>🔍 Analyzing Location Data</h3>
                <p>
                  Running distance calculations and finding optimal route...
                </p>
              </div>
            </div>
          )}

          {results && !isProcessing && (
            <div className={styles.resultsSection}>
              <Dashboard results={results} onReset={handleReset} />
            </div>
          )}
        </div>

        {!results && (
          <div className={styles.howItWorks}>
            <h2>🚀 How It Works</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h4>Upload Data</h4>
                <p>Upload a .txt file or paste location pairs directly</p>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h4>Process</h4>
                <p>Our algorithm analyzes and calculates optimal distances</p>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h4>View Results</h4>
                <p>Get detailed results with statistics and visualizations</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}