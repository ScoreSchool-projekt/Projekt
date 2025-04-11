import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Modal, ImageBackground, Alert } from 'react-native';
import { bejelentkezes, regisztracio } from '../../scripts/bejelentkezes';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function TabOneScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [nev, setNev] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLoginMode) {
        const user = await bejelentkezes(email, jelszo);
        console.log('Bejelentkezett felhasználó:', user);
        router.push('/explore'); 
      } else {
        let adatok = { nev, email, jelszo };
        await regisztracio(adatok);
        setIsLoginMode(true);
      }
      
      setModalVisible(false);

    } catch (error) {
      Alert.alert('Hiba!', error.message || 'Valami hiba történt.');
    }
  };
  
  

  return (
    <ImageBackground source={require('../../assets/images/hattersm.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.title}>ScoreSchool</Text>
          </View>
          <Text style={styles.subtitle}>Hozd ki a legtöbbet az iskolai fociból!</Text>
          <Text style={styles.description}>
            Tornák, mérkőzések, statisztikák – minden, amire egy iskolai bajnokság során szükség van.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Gyere kezdjünk!</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.funkciok}>
          <View style={styles.funkcio}>
            <Text style={styles.funkcioTitle}>Keresés</Text>
            <Text style={styles.funkcioText}>Találj meg gyorsan csapatokat és eredményeket.</Text>
          </View>
          <View style={styles.funkcio}>
            <Text style={styles.funkcioTitle}>Adat mentés</Text>
            <Text style={styles.funkcioText}>Rögzítsd és tárold az adatokat egyszerűen.</Text>
          </View>
          <View style={styles.funkcio}>
            <Text style={styles.funkcioTitle}>Statisztika</Text>
            <Text style={styles.funkcioText}>Elemezd a teljesítményt részletes statisztikákkal.</Text>
          </View>
        </View>

        {/* MODAL - Bejelentkezés/Regisztráció */}
        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{isLoginMode ? 'Bejelentkezés' : 'Regisztráció'}</Text>
              {!isLoginMode && (
                <TextInput
                  style={styles.input}
                  placeholder="Név"
                  placeholderTextColor="white"
                  value={nev}
                  onChangeText={setNev}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="white"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Jelszó"
                placeholderTextColor="white"
                secureTextEntry
                value={jelszo}
                onChangeText={setJelszo}
              />
              <TouchableOpacity style={styles.modalButton} onPress={handleAuth}>
                <Text style={styles.buttonText}>{isLoginMode ? 'Belépés' : 'Regisztráció'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)}>
                <Text style={styles.switchText}>
                  {isLoginMode ? 'Nincs még fiókod? Regisztráció' : 'Van már fiókod? Bejelentkezés'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Bezárás</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logo: { width: 100, height: 100, resizeMode: 'contain', left: -50 },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white', left: -40 },
  textContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 26,
    color: 'white',
    marginTop: 5,
    textAlign: 'center'
  },
  description: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  funkciok: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    width: '90%',
    marginTop: 50,
    padding: 10,
  },
  funkcio: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  funkcioTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  funkcioText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  switchText: {
    color: 'white',
    marginTop: 10,
    textDecorationLine: 'underline',
  }
});
