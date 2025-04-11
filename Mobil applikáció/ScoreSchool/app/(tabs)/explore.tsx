import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { getMindenTabla} from '../../scripts/adatok';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function Explore() {
  const router = useRouter();
  const [profil, setProfil] = useState([]);
  const [csapat, setCsapat] = useState([]);
  const [torna, setTorna] = useState([]);
  const [jatekos, setJatekos] = useState([]);
  const [meccs, setMeccs] = useState([]);
  const [csoport, setCsoport] = useState([]);

  const [kivalasztottKategoria, setKivalasztottKategoria] = useState('');
  const [keresett, setKeresett] = useState('');
  const [eredmenyek, setEredmenyek] = useState([]);
  const kategoriak = ['torna', 'csapat', 'jatekos'];

  useEffect(() => {
    tombokFeltoltese();
  }, []);

  useEffect(() => {
    Kereses();
  }, [keresett, kivalasztottKategoria]);



  const tombokFeltoltese = async () => {
    try {
      const [profilData, csapatData, tornaData, jatekosData, meccsData, csoportData] = await getMindenTabla();
      console.log("Torna adatok:", tornaData);
      const meccsAdatok = meccsData.map(meccs => ({
        ...meccs,
        hazaiCsapat: csapatData.find(c => c.id === meccs.csapat1)?.csapatneve || 'Ismeretlen',
        vendegCsapat: csapatData.find(c => c.id === meccs.csapat2)?.csapatneve || 'Ismeretlen'
      }));
      setProfil(profilData);
      setCsapat(csapatData);
      setTorna(tornaData);
      setJatekos(jatekosData);
      setMeccs(meccsAdatok);
      setCsoport(csoportData);
      setEredmenyek(meccsAdatok);
    } catch (error) {
      console.error('Hiba történt az adatok lekérése közben:', error);
    }
  };
  
  const Kereses = () => {
    if (!kivalasztottKategoria ||!keresett.trim) {
      return setEredmenyek(meccs);
    }

    let szurtEredmenyek = [];

    switch (kivalasztottKategoria) {
      case 'torna':
        szurtEredmenyek = torna.filter(t => t.tornaneve.toLowerCase().includes(keresett.toLowerCase()));
        break;
      case 'csapat':
        szurtEredmenyek = csapat.filter(c => c.csapatneve.toLowerCase().includes(keresett.toLowerCase()));
        szurtEredmenyek.forEach(csapat => {
          const tornaNev = torna.find(t => t.id === csapat.tornaid)?.tornaneve || 'Ismeretlen';
          csapat.tornanev = tornaNev;
        });
        break;
      case 'jatekos':
        szurtEredmenyek = jatekos.filter(j => j.nev.toLowerCase().includes(keresett.toLowerCase()));
        szurtEredmenyek.forEach(jatekos => {
          const csapatNev = csapat.find(c => c.id === jatekos.csapatid)?.csapatneve || 'Ismeretlen';
          jatekos.csapatnev = csapatNev;
        });
        break;
      default:
        szurtEredmenyek = meccs;
        break;
    }
    setEredmenyek(szurtEredmenyek);
  };

  return (
    <ImageBackground source={require('../../assets/images/hattersm.png')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.header}  onPress={() => router.push('/')}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.title}>ScoreSchool</Text>
          </TouchableOpacity>
          <Picker
  selectedValue={kivalasztottKategoria}
  onValueChange={(itemValue) => setKivalasztottKategoria(itemValue)}
  style={styles.picker}
  dropdownIconColor="white"
  mode="dropdown"
>
  <Picker.Item label="Válassz kategóriát" value="" style={styles.legordulo} />
  {kategoriak.map(cat => <Picker.Item key={cat} label={cat} value={cat} style={styles.legordulo}/>)}
</Picker>

        <View style={styles.searchContainer}>
        <TextInput
          value={keresett}
          onChangeText={setKeresett}
          placeholder="Keresés..."
          style={styles.input}
        />
        <TouchableOpacity onPress={Kereses} style={styles.searchButton}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
      </View>

      <FlatList
  style={styles.lista}
  data={eredmenyek}
  keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
  renderItem={({ item }) => (
    <View style={styles.resultItem}>
      {item.hazaiCsapat && item.vendegCsapat ? (
        <>
          <Text style={styles.resultTitle}>{item.hazaiCsapat} vs {item.vendegCsapat}</Text>
          <Text style={styles.resultText}>Eredmény: {item.cs1gol} - {item.cs2gol}</Text>
        </>
      ) : item.gyozelmek !== undefined ? (  // Csapat esetén
        <>
          <Text style={styles.resultTitle}>{item.csapatneve} ({item.tornanev})</Text>
          
          <Text style={styles.resultText}>Győzelem: {item.gyozelmek}  |  Döntetlen: {item.dontetlenek}  |  Vereség: {item.veresegek}</Text>
        </>
      ) : item.golokszama !== undefined ? (  // Játékos esetén
        <>
          <Text style={styles.resultTitle}>{item.nev} ({item.csapatnev})</Text>
          <Text style={styles.resultText}>Gólok: {item.golokszama} | Sárga lapok: {item.sargalapok} | Piros lapok: {item.piroslapok}</Text>
        </>
      ) : (
        <Text style={styles.resultTitle}>{item.tornaneve || item.csapatneve || item.nev}</Text>
        
      )}
    </View>
  )}
/>

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
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom:200,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logo: { width: 100, height: 100, resizeMode: 'contain', left: -50 },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white', left: -40 },
  picker: {
    height: 50,
    backgroundColor: '#333',
    color: 'white', 
    borderRadius: 5, 
    marginBottom: 10,
    borderWidth: 0, 
    elevation: 0,  
    overflow: 'hidden',
  },  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#333',
    color: 'white'
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 5,
  },
  resultItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  resultText: {
    fontSize: 16,
    color: 'white',
  },
  lista:{
    marginBottom:50,
  },
  legordulo:{
    backgroundColor: '#333',
    color: 'white',
  }
});
