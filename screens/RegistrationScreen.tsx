import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const RegistrationScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter an email.');
    } else if (password.trim() === '') {
      Alert.alert('Error', 'Please enter a password.');
    } else if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
    } else if (confirmPassword.trim() === '') {
      Alert.alert('Error', 'Please confirm your password.');
    } else if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
    } else {
      try {
        // Create a new user with email and password
        const response = await auth().createUserWithEmailAndPassword(email, password);
        // Registration successful
        Alert.alert('Registration Successful', 'Welcome, ' + response.user.email + '!');
        // Navigate back to LoginScreen after successful registration
        navigation.navigate('Login');
      } catch (error) {
        // Handle registration error
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'The email address is already in use. Please use a different email.');
        } else {
          Alert.alert('Error', 'Registration failed. Please try again.');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RegistrationScreen;
