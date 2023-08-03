import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const RegistrationScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setIsLoading(true); // Show the loader
  
        // Check if the user already exists in AsyncStorage
        const existingUsersData = await AsyncStorage.getItem('users');
        const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
  
        const existingUser = existingUsers.find(user => user.email === email);
        if (existingUser) {
          setIsLoading(false); // Hide the loader
          Alert.alert('Error', 'The email address is already in use. Please use a different email.');
          return;
        }
  
        // Create a new user object
        const newUser = { email, password };
  
        // Add the new user to the array of users
        const updatedUsers = [...existingUsers, newUser];
  
        // Save the updated array of users in AsyncStorage
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
  
        setIsLoading(false); // Hide the loader after successful registration
  
        // Registration successful
        Alert.alert('Registration Successful' + email + '!');
  
        // Navigate back to LoginScreen after successful registration
        navigation.navigate("Login");
      } catch (error) {
        setIsLoading(false); // Hide the loader after registration failure
  
        // Handle registration error
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    }
  };
  
  
  

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Screen</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
          <Icon
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={toggleConfirmPasswordVisibility}>
          <Icon
            name={showConfirmPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
        <Text style={styles.loginLinkText}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F3E6', // Light beige background color
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
    borderColor: '#E9B44C', // Light orange border color
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#4CAF50', // Vibrant green button color
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    marginBottom: 20,
  },
  loginLinkText: {
    color: '#007AFF', // Vibrant blue color for login link
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    borderColor: '#E9B44C', // Light orange border color
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default RegistrationScreen;
