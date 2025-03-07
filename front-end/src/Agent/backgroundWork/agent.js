import { useState, useEffect } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

export const useQnAModel = () => {
  const [qnaModel, setQnaModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);

  const loadModels = async () => {
    try {
      setModelLoading(true);
      setModelError(null);
      const modelOptions = {
        fromTFHub: true,
        modelUrl: 'https://tfhub.dev/tensorflow/tfjs-model/mobilebert/1/default/1',
        requestInit: {
          mode: 'cors',
          credentials: 'omit',
          cache: 'force-cache'
        }
      };
      try {
        console.log('Attempting to load QnA model...');
        const loadedQnaModel = await qna.load();
        setQnaModel(loadedQnaModel);
        console.log('QnA model loaded successfully!');
      } catch (primaryError) {
        console.error('Primary model loading failed:', primaryError);
        try {
          console.log('Attempting to load QnA model with explicit options...');
          const loadedQnaModel = await qna.load(modelOptions);
          setQnaModel(loadedQnaModel);
          console.log('QnA model loaded successfully with explicit options!');
        } catch (secondaryError) {
          setModelError({
            message: "Could not load TensorFlow QnA model due to CORS restrictions. Using simplified fallback model.",
            details: secondaryError.message
          });
        }
      }
      
      await tf.ready();
      console.log('TensorFlow.js is ready for entity extraction.');
      
    } catch (error) {
      console.error('Error in model initialization process:', error);
      setModelError({
        message: "Failed to initialize models",
        details: error.message
      })
    } finally {
      setModelLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
    return () => {
      tf.disposeVariables();
    };
  }, []);

  return { qnaModel, modelLoading, modelError };
};