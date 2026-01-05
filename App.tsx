import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
  Code
} from 'react-native-vision-camera';

type ScannedCodeType = {
  value: string;
  type: string;
} | null;

export default function App() {
  const [isActive, setIsActive] = useState(true);
  const [scannedCode, setScannedCode] = useState<ScannedCodeType>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: [
      'qr',          // QR Code
      'ean-13',      // Código de barras de produtos (padrão internacional)
      'ean-8',       // Código de barras para produtos menores
      'upc-a',       // Código de barras norte-americano
      'upc-e',       // UPC compactado
      'code-128',    // Logística, transporte
      'code-39',     // Indústria, automotivo
      'itf',         // Caixas, logística (Interleaved 2 of 5)
      'code-93'      // Complemento ao Code-39
    ],
    onCodeScanned: (codes: Code[]) => {
      if (codes.length > 0) {
        const code = codes[0];
        console.log('Scanned:', code.value);
        console.log('Type:', code.type);
        
        setScannedCode({
          value: code.value || '',
          type: code.type || 'unknown'
        });
        
        // Para resetar o código escaneado após alguns segundos:
        setTimeout(() => {
          setScannedCode(null);
        }, 3000);
      }
    }
  });

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Precisamos de permissão para acessar a câmera</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Dispositivo de câmera não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />
      
      {/* Overlay para mostrar o código escaneado */}
      {scannedCode && (
        <View style={styles.overlay}>
          <Text style={styles.scannedText}>
            Código: {scannedCode.value}
          </Text>
          <Text style={styles.typeText}>
            Tipo: {scannedCode.type}
          </Text>
        </View>
      )}
      
      {/* Mensagem de instrução */}
      <View style={styles.instructionOverlay}>
        <Text style={styles.instructionText}>
          Aponte a câmera para um código QR ou de barras
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scannedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  typeText: {
    color: 'lightgray',
    fontSize: 14,
  },
  instructionOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});