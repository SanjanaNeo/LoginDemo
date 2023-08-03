import React, {useState, FC, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

const RegistrationScreen: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
  });

  const navigation = useNavigation();

  const validateEmail = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (email: string) => emailRegex.test(email);
  }, []);

  const validatePassword = useMemo(() => {
    return (password: string) => password.length >= 6;
  }, []);

  const handleRegister = async () => {
    const {email, password, confirmPassword} = formData;

    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter an email.');
      return;
    } else if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    } else if (password.trim() === '') {
      Alert.alert('Error', 'Please enter a password.');
      return;
    } else if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    } else if (confirmPassword.trim() === '') {
      Alert.alert('Error', 'Please confirm your password.');
      return;
    } else if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
      return;
    }

    try {
      setFormData(prevData => ({...prevData, isLoading: true})); // Show the loader

      // Check if the user already exists in AsyncStorage
      const existingUsersData = await AsyncStorage.getItem('users');
      const existingUsers = existingUsersData
        ? JSON.parse(existingUsersData)
        : [];

      const existingUser = existingUsers.find(user => user.email === email);
      if (existingUser) {
        setFormData(prevData => ({...prevData, isLoading: false})); // Hide the loader
        Alert.alert(
          'Error',
          'The email address is already in use. Please use a different email.',
        );
        return;
      }

      // Create a new user object
      const newUser = {email, password};

      // Add the new user to the array of users
      const updatedUsers = [...existingUsers, newUser];

      // Save the updated array of users in AsyncStorage
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

      setFormData(prevData => ({...prevData, isLoading: false})); // Hide the loader after successful registration

      // Registration successful
      Alert.alert('Registration Successful', ` ${email}!`);

      // Navigate back to LoginScreen after successful registration
      navigation.navigate('Login');
    } catch (error) {
      setFormData(prevData => ({...prevData, isLoading: false})); // Hide the loader after registration failure

      // Handle registration error
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const togglePasswordVisibility = () => {
    setFormData(prevData => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const toggleConfirmPasswordVisibility = () => {
    setFormData(prevData => ({
      ...prevData,
      showConfirmPassword: !prevData.showConfirmPassword,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Screen</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={text =>
            setFormData(prevData => ({...prevData, email: text}))
          }
          autoCapitalize="none"
        />
      </View>
      {formData.email.trim() !== '' && !validateEmail(formData.email) && (
        <Text style={styles.errorText}>Invalid email format</Text>
      )}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!formData.showPassword}
          value={formData.password}
          onChangeText={text =>
            setFormData(prevData => ({...prevData, password: text}))
          }
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}>
          <Icon
            name={formData.showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      {formData.password.trim() !== '' &&
        !validatePassword(formData.password) && (
          <Text style={styles.errorText}>
            Password must be at least 6 characters long
          </Text>
        )}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry={!formData.showConfirmPassword}
          value={formData.confirmPassword}
          onChangeText={text =>
            setFormData(prevData => ({...prevData, confirmPassword: text}))
          }
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleConfirmPasswordVisibility}>
          <Icon
            name={formData.showConfirmPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      {formData.confirmPassword.trim() !== '' &&
        formData.password !== formData.confirmPassword && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={formData.isLoading}>
        {formData.isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
        <Text style={styles.loginLinkText}>
          Already have an account? Login here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F3E6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
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
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    borderColor: '#E9B44C',
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
  errorText: {
    color: 'red',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 5,
  },
});

export default RegistrationScreen;
