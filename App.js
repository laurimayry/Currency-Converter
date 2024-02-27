import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { useState, useEffect } from 'react';
import {Picker} from '@react-native-picker/picker';

export default function App() {


  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [amount, setAmount] = useState();
  const [convertedAmount, setConvertedAmount] = useState(null);



    useEffect(() => {
    // Hae valuuttakurssit API:sta ja päivitä currencies-tila
    const fetchCurrencies = async () => {
      try {
        const apiKey = 'UTz1DuvQkcv9SAs4orQ7PhzVi5jhUnoM';
        const response = await fetch('https://api.apilayer.com/exchangerates_data/latest', {
          headers: {
            'apikey': apiKey,
          },
        });
        const data = await response.json();
        console.log('Data: ', data)
        const currencyList = Object.keys(data.rates);
        console.log('Currency lista', currencyList)
        setCurrencies(currencyList);
      } catch (error) {
        console.error('Virhe haettaessa valuuttoja:', error);
      }
    };

    fetchCurrencies();
  }, []); 

  const convertAmount = async () => {
    if (selectedCurrency && amount) {
      try {
        const apiKey = 'UTz1DuvQkcv9SAs4orQ7PhzVi5jhUnoM';
        const response = await fetch(`https://api.apilayer.com/exchangerates_data/latest?apikey=${apiKey}`);
        const data = await response.json();
        const rate = data.rates[selectedCurrency];
        const converted = parseFloat(amount) / rate;
        setConvertedAmount(converted.toFixed(2));
      } catch (error) {
        console.error('Virhe muunnetun summan laskemisessa:', error);
      }
    }
  }

  return (
    <>
    <View style={styles.container}>
      <Text>euroissa: {convertedAmount}</Text>
    <View style={styles.inputContainer}>

    <TextInput 
      style={styles.textInput}
      placeholder="Syötä summa" 
      keyboardType="numeric"
      value={amount}
      onChangeText={(text) => setAmount(text)}
      />

    <Picker style={styles.picker}
        selectedValue={selectedCurrency}
        onValueChange={(itemValue, itemIndex) => {setSelectedCurrency(itemValue)}}>
        <Picker.Item label="Valitse valuutta" value="" />
        {currencies.map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
    </Picker>
    </View>

    <Button title="Convert" onPress={convertAmount} style={styles.convertButton} />
     

    <StatusBar style="auto" />

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 100,
    marginLeft: 100
  },
  
  picker: {
    flex: 2,
   
  },
  textInput: {
    flex: 1,
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  convertButton: {
    marginTop: 10,
  },
}); 
